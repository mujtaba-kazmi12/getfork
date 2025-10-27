import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' region
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for R2 compatibility
});

/**
 * Generate a unique filename with timestamp and random string
 * @param {string} originalName - Original filename
 * @param {boolean} isResized - Whether the image was resized
 * @returns {string} - Unique filename with folder path
 */
export function generateUniqueFilename(originalName, isResized = false) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString('hex').substring(0, 11); // Use hex and limit length
  const extension = originalName.split('.').pop();
  const prefix = isResized ? 'resized_' : '';
  const filename = `${prefix}${timestamp}_${randomString}.${extension}`;
  return `getfork-images/${filename}`;
}

/**
 * Resize image using Sharp
 * @param {Buffer} imageBuffer - Image buffer
 * @param {number} width - Target width (optional)
 * @param {number} height - Target height (optional)
 * @param {number} quality - JPEG quality (1-100, default: 80)
 * @returns {Promise<Buffer>} - Resized image buffer
 */
export async function resizeImage(imageBuffer, width, height, quality = 80) {
  try {
    let sharpInstance = sharp(imageBuffer);
    
    // Get image metadata to check format
    const metadata = await sharpInstance.metadata();
    
    // Apply resize if width or height is specified
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge smaller images
      });
    }
    
    // Apply compression based on format
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (metadata.format === 'png') {
      sharpInstance = sharpInstance.png({ compressionLevel: 9 });
    } else if (metadata.format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    }
    
    return await sharpInstance.toBuffer();
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Upload image to Cloudflare R2
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} filename - Filename for the uploaded image
 * @param {string} contentType - MIME type of the image
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadImageToR2(imageBuffer, filename, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: filename,
      Body: imageBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
    });

    await s3Client.send(command);
    
    // Return the public URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}`;
    return publicUrl;
  } catch (error) {
    throw new Error(`Upload to R2 failed: ${error.message}`);
  }
}

/**
 * Process and upload image with optional resizing
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} originalFilename - Original filename
 * @param {string} contentType - MIME type
 * @param {Object} options - Processing options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {number} options.quality - Image quality (1-100)
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
export async function processAndUploadImage(imageBuffer, originalFilename, contentType, options = {}) {
  try {
    const { width, height, quality = 80 } = options;
    
    // Check if image will be resized
    const isResized = !!(width || height);
    
    // Generate unique filename with folder path
    const filename = generateUniqueFilename(originalFilename, isResized);
    
    // Resize image if dimensions are provided
    let processedBuffer = imageBuffer;
    if (isResized) {
      processedBuffer = await resizeImage(imageBuffer, width, height, quality);
    }
    
    // Upload to R2
    const publicUrl = await uploadImageToR2(processedBuffer, filename, contentType);
    
    // Get processed image metadata
    const metadata = await sharp(processedBuffer).metadata();
    
    return {
      url: publicUrl,
      filename,
      originalFilename,
      size: processedBuffer.length,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      contentType,
    };
  } catch (error) {
    throw new Error(`Image processing and upload failed: ${error.message}`);
  }
}