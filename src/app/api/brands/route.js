import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { extractTokenFromHeader, verifyToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import Brand from '@/models/Brand';
import { createDefaultFAQs } from '@/lib/defaultFAQs';
import FAQ from '@/models/FAQ';

// POST /api/brands
// Creates or updates a brand for the authenticated user (upsert by userId+brandId)
export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(createErrorResponse('Authorization token missing'), { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      return NextResponse.json(createErrorResponse('Invalid or expired token'), { status: 401 });
    }

    const userId = decoded?.userId;
    if (!userId) {
      return NextResponse.json(createErrorResponse('Invalid token payload: userId not found'), { status: 401 });
    }

    const body = await request.json();
    const {
      brandId: brandIdInput,
      brand_fetch,
      restaurantName: restaurantNameInput,
      style,
      restaurantLogo,
      restaurantBanner,
      websiteUrl,
      address,
      contactNumber,
      restaurantTiming,
      emailAddresses,
    } = body || {};

    if (!brand_fetch || typeof brand_fetch !== 'object') {
      return NextResponse.json(createErrorResponse('brand_fetch object is required'), { status: 400 });
    }

    const brandId = (brandIdInput || brand_fetch?.id || '').toString().trim();
    if (!brandId) {
      return NextResponse.json(createErrorResponse('brandId is required'), { status: 400 });
    }

    const restaurantName = (restaurantNameInput || brand_fetch?.name || '').toString().trim();
    const primaryColor = (style?.primaryColor || '').toString().trim();

    // Prepare document fields with new optional fields
    const updateDoc = {
      restaurantName,
      style: { primaryColor },
      brand_fetch,
    };

    // Add optional fields only if they are provided
    if (restaurantLogo !== undefined) {
      updateDoc.restaurantLogo = (restaurantLogo || '').toString().trim();
    }
    if (restaurantBanner !== undefined) {
      updateDoc.restaurantBanner = (restaurantBanner || '').toString().trim();
    }
    if (websiteUrl !== undefined) {
      updateDoc.websiteUrl = (websiteUrl || '').toString().trim();
    }
    if (address !== undefined) {
      updateDoc.address = (address || '').toString().trim();
    }
    if (contactNumber !== undefined) {
      updateDoc.contactNumber = (contactNumber || '').toString().trim();
    }
    if (restaurantTiming !== undefined && Array.isArray(restaurantTiming)) {
      updateDoc.restaurantTiming = restaurantTiming.map(timing => ({
        day: (timing?.day || '').toString().trim(),
        status: (timing?.status || '').toString().trim(),
        openTime: (timing?.openTime || '').toString().trim(),
        closeTime: (timing?.closeTime || '').toString().trim(),
      }));
    }
    if (emailAddresses !== undefined && Array.isArray(emailAddresses)) {
      updateDoc.emailAddresses = emailAddresses.map(email => 
        (typeof email === 'string' ? email : email?.email || '').toString().trim()
      ).filter(email => email !== '');
    }

    // Let's check if this is a new brand by seeing if it existed before
    const brandBefore = await Brand.findOne({ userId, brandId });
    
    // Upsert brand per userId + brandId
    const brand = await Brand.findOneAndUpdate(
      { userId, brandId },
      { $set: updateDoc, $setOnInsert: { userId, brandId } },
      { upsert: true, new: true }
    );

    const isNew = !brandBefore;
    
    console.log('Brand processing:', {
      brandId,
      userId,
      isNew,
      brandBefore: !!brandBefore,
      brandAfter: brand
    });

    // Always create default FAQs for brands (regardless of whether new or existing)
    try {
      console.log('Creating default FAQs for brand:', { brandId, userId, isNew });
      await createDefaultFAQs(userId, brandId);
      console.log('Successfully created default FAQs for brand:', brandId);
    } catch (error) {
      console.error('Error creating default FAQs for brand:', error);
    }
    
    return NextResponse.json(
      createSuccessResponse('Brand saved successfully', { brand }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Create brand error:', error);
    // Handle duplicate key errors (should be rare due to upsert)
    if (error.code === 11000) {
      return NextResponse.json(createErrorResponse('Duplicate brand for this user'), { status: 409 });
    }
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}

// GET /api/brands
// Lists brands for the authenticated user
export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(createErrorResponse('Authorization token missing'), { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      return NextResponse.json(createErrorResponse('Invalid or expired token'), { status: 401 });
    }

    const userId = decoded?.userId;
    if (!userId) {
      return NextResponse.json(createErrorResponse('Invalid token payload: userId not found'), { status: 401 });
    }

    const brands = await Brand.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(
      createSuccessResponse('Brands fetched successfully', { brands }),
      { status: 200 }
    );
  } catch (error) {
    console.error('List brands error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}