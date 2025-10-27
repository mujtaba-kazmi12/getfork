import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { extractTokenFromHeader, verifyToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function GET(request) {
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

    // Get brandId from query parameters
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        createErrorResponse('brandId query parameter is required'),
        { status: 400 }
      );
    }

    // Query FAQs from database based only on brandId
    const faqs = await FAQ.find({ 
      brandId: brandId 
    }).sort({ createdAt: -1 }); // Sort by newest first

    // Return success response with FAQs
    return NextResponse.json(
      createSuccessResponse(
        'FAQs retrieved successfully',
        {
          faqs: faqs,
          count: faqs.length,
          brandId: brandId
        }
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Get FAQs error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}