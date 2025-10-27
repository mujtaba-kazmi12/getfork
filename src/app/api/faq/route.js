import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { extractTokenFromHeader, verifyToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authorization token is missing'),
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        createErrorResponse('Invalid or expired token'),
        { status: 401 }
      );
    }

    const userId = decoded?.userId;
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('User ID missing in token'),
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { brandId, uploadType, filename, date, data } = body || {};

    // Validate required fields
    if (!brandId) {
      return NextResponse.json(
        createErrorResponse('brandId is required'),
        { status: 400 }
      );
    }
    if (data === undefined || data === null) {
      return NextResponse.json(
        createErrorResponse('data is required'),
        { status: 400 }
      );
    }

    // Check if we need to update an existing FAQ entry (for specific filenames)
    const normalizedFilename = filename ? String(filename).trim() : '';
    
    // List of filenames that should be updated instead of creating duplicates
    const updateableFilenames = ['Faq Default', 'restuarant setting', 'delivery'];
    
    if (updateableFilenames.includes(normalizedFilename)) {
      // Update existing FAQ entry if it exists, create if it doesn't (upsert)
      const existingFaq = await FAQ.findOneAndUpdate(
        {
          userId,
          brandId: String(brandId).trim(),
          filename: normalizedFilename
        },
        {
          $set: {
            uploadType: uploadType ? String(uploadType).trim() : '',
            date: date ? new Date(date) : new Date(),
            data,
            updatedAt: new Date()
          }
        },
        { 
          new: true, // Return the updated document
          upsert: true // Create if it doesn't exist
        }
      );

      return NextResponse.json(
        createSuccessResponse('FAQ updated successfully', {
          id: existingFaq._id,
          userId: existingFaq.userId,
          brandId: existingFaq.brandId,
          uploadType: existingFaq.uploadType,
          filename: existingFaq.filename,
          date: existingFaq.date,
          data: existingFaq.data,
          createdAt: existingFaq.createdAt,
          updatedAt: existingFaq.updatedAt,
        }),
        { status: 200 }
      );
    } else {
      // Create new FAQ entry for other filenames
      const faqDoc = new FAQ({
        userId,
        brandId: String(brandId).trim(),
        uploadType: uploadType ? String(uploadType).trim() : '',
        filename: normalizedFilename,
        date: date ? new Date(date) : new Date(),
        data,
      });

      await faqDoc.save();

      return NextResponse.json(
        createSuccessResponse('FAQ saved successfully', {
          id: faqDoc._id,
          userId: faqDoc.userId,
          brandId: faqDoc.brandId,
          uploadType: faqDoc.uploadType,
          filename: faqDoc.filename,
          date: faqDoc.date,
          data: faqDoc.data,
          createdAt: faqDoc.createdAt,
          updatedAt: faqDoc.updatedAt,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('FAQ save error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        createErrorResponse(messages.join(', ')),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}