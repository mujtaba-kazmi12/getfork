import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import { extractTokenFromHeader, verifyToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

// POST - Create or Update Delivery Settings
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
    const {
      brandId,
      deliveryType,
      deliveryDistance,
      category,
      deliveryArea,
      orderingPlatforms,
      typeOfOrders,
      deliveryFee,
      minimumOrderAmount,
      additionalCharges,
      availability,
      estimateDeliveryTime,
      deliveryNotes,
      deliveryInquiriesPhone,
      deliveryInquiriesEmail,
    } = body || {};

    // Validate required fields
    if (!brandId) {
      return NextResponse.json(
        createErrorResponse('brandId is required'),
        { status: 400 }
      );
    }

    // Prepare update document
    const updateDoc = {
      userId,
      brandId: String(brandId).trim(),
    };

    // Add optional fields
    if (deliveryType !== undefined && Array.isArray(deliveryType)) {
      updateDoc.deliveryType = deliveryType.map(type => String(type).trim()).filter(type => type !== '');
    }

    if (deliveryDistance !== undefined) {
      updateDoc.deliveryDistance = String(deliveryDistance || '').trim();
    }

    if (category !== undefined) {
      updateDoc.category = String(category || '').trim();
    }

    if (deliveryArea !== undefined) {
      updateDoc.deliveryArea = String(deliveryArea || '').trim();
    }

    if (orderingPlatforms !== undefined && Array.isArray(orderingPlatforms)) {
      updateDoc.orderingPlatforms = orderingPlatforms.map(platform => String(platform).trim()).filter(platform => platform !== '');
    }

    if (typeOfOrders !== undefined) {
      updateDoc.typeOfOrders = String(typeOfOrders || '').trim();
    }

    if (deliveryFee !== undefined) {
      updateDoc.deliveryFee = String(deliveryFee || '').trim();
    }

    if (minimumOrderAmount !== undefined) {
      updateDoc.minimumOrderAmount = String(minimumOrderAmount || '').trim();
    }

    if (additionalCharges !== undefined) {
      updateDoc.additionalCharges = String(additionalCharges || '').trim();
    }

    if (availability !== undefined) {
      updateDoc.availability = String(availability || '').trim();
    }

    if (estimateDeliveryTime !== undefined) {
      updateDoc.estimateDeliveryTime = String(estimateDeliveryTime || '').trim();
    }

    if (deliveryNotes !== undefined) {
      updateDoc.deliveryNotes = String(deliveryNotes || '').trim();
    }

    if (deliveryInquiriesPhone !== undefined) {
      updateDoc.deliveryInquiriesPhone = String(deliveryInquiriesPhone || '').trim();
    }

    if (deliveryInquiriesEmail !== undefined) {
      updateDoc.deliveryInquiriesEmail = String(deliveryInquiriesEmail || '').trim();
    }

    // Upsert delivery settings (update if exists, create if doesn't)
    const delivery = await Delivery.findOneAndUpdate(
      { userId, brandId: String(brandId).trim() },
      { $set: updateDoc },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(
      createSuccessResponse('Delivery settings saved successfully', {
        delivery: {
          id: delivery._id,
          userId: delivery.userId,
          brandId: delivery.brandId,
          deliveryType: delivery.deliveryType,
          deliveryDistance: delivery.deliveryDistance,
          category: delivery.category,
          deliveryArea: delivery.deliveryArea,
          orderingPlatforms: delivery.orderingPlatforms,
          typeOfOrders: delivery.typeOfOrders,
          deliveryFee: delivery.deliveryFee,
          minimumOrderAmount: delivery.minimumOrderAmount,
          additionalCharges: delivery.additionalCharges,
          availability: delivery.availability,
          estimateDeliveryTime: delivery.estimateDeliveryTime,
          deliveryNotes: delivery.deliveryNotes,
          deliveryInquiriesPhone: delivery.deliveryInquiriesPhone,
          deliveryInquiriesEmail: delivery.deliveryInquiriesEmail,
          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delivery save error:', error);

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

// GET - Retrieve Delivery Settings
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

    // Find delivery settings for the brand
    const delivery = await Delivery.findOne({
      userId,
      brandId: String(brandId).trim(),
    });

    if (!delivery) {
      return NextResponse.json(
        createSuccessResponse('No delivery settings found', {
          delivery: null,
        }),
        { status: 200 }
      );
    }

    return NextResponse.json(
      createSuccessResponse('Delivery settings retrieved successfully', {
        delivery: {
          id: delivery._id,
          userId: delivery.userId,
          brandId: delivery.brandId,
          deliveryType: delivery.deliveryType,
          deliveryDistance: delivery.deliveryDistance,
          category: delivery.category,
          deliveryArea: delivery.deliveryArea,
          orderingPlatforms: delivery.orderingPlatforms,
          typeOfOrders: delivery.typeOfOrders,
          deliveryFee: delivery.deliveryFee,
          minimumOrderAmount: delivery.minimumOrderAmount,
          additionalCharges: delivery.additionalCharges,
          availability: delivery.availability,
          estimateDeliveryTime: delivery.estimateDeliveryTime,
          deliveryNotes: delivery.deliveryNotes,
          deliveryInquiriesPhone: delivery.deliveryInquiriesPhone,
          deliveryInquiriesEmail: delivery.deliveryInquiriesEmail,
          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delivery fetch error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
