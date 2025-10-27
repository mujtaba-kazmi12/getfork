import { NextResponse } from 'next/server';
import { processAndUploadImage } from '@/lib/cloudflare';

export async function POST(request) {
  try {

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image');
    const width = formData.get('width');
    const height = formData.get('height');
    const quality = formData.get('quality');

    // Validate file
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'Image file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Parse resize parameters
    const resizeOptions = {};
    
    if (width) {
      const parsedWidth = parseInt(width, 10);
      if (isNaN(parsedWidth) || parsedWidth <= 0 || parsedWidth > 4000) {
        return NextResponse.json(
          { success: false, message: 'Invalid width. Must be a number between 1 and 4000' },
          { status: 400 }
        );
      }
      resizeOptions.width = parsedWidth;
    }

    if (height) {
      const parsedHeight = parseInt(height, 10);
      if (isNaN(parsedHeight) || parsedHeight <= 0 || parsedHeight > 4000) {
        return NextResponse.json(
          { success: false, message: 'Invalid height. Must be a number between 1 and 4000' },
          { status: 400 }
        );
      }
      resizeOptions.height = parsedHeight;
    }

    if (quality) {
      const parsedQuality = parseInt(quality, 10);
      if (isNaN(parsedQuality) || parsedQuality < 1 || parsedQuality > 100) {
        return NextResponse.json(
          { success: false, message: 'Invalid quality. Must be a number between 1 and 100' },
          { status: 400 }
        );
      }
      resizeOptions.quality = parsedQuality;
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Process and upload image
    const uploadResult = await processAndUploadImage(
      imageBuffer,
      file.name,
      file.type,
      resizeOptions
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        data: {
          ...uploadResult,
          uploadedAt: new Date().toISOString(),
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Image upload error:', error);

    // Handle specific errors
    if (error.message.includes('Image processing failed')) {
      return NextResponse.json(
        { success: false, message: `Image processing error: ${error.message}` },
        { status: 400 }
      );
    }

    if (error.message.includes('Upload to R2 failed')) {
      return NextResponse.json(
        { success: false, message: `Upload error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}