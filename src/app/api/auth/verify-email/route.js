import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse, generateToken } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { token } = await request.json();

    // Validate token
    if (!token) {
      return NextResponse.json(
        createErrorResponse('Verification token is required'),
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching verification token and check if token is not expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Invalid or expired verification token'),
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        createErrorResponse('Email is already verified'),
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT token for the user
    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified
    });

    // Return success response with user data and token
    return NextResponse.json(
      createSuccessResponse(
        'Email verified successfully! You can now sign in.',
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          token: jwtToken
        }
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// GET method for email verification via URL (when user clicks link in email)
export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    // Get token from URL parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate token
    if (!token) {
      return NextResponse.json(
        createErrorResponse('Verification token is required'),
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching verification token and check if token is not expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Invalid or expired verification token'),
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        createSuccessResponse('Email is already verified'),
        { status: 200 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT token for the user
    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified
    });

    // Return success response with user data and token
    return NextResponse.json(
      createSuccessResponse(
        'Email verified successfully! You can now sign in.',
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          token: jwtToken
        }
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}