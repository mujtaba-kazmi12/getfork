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
    const { token, password, confirmPassword } = await request.json();

    // Validate required fields
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        createErrorResponse('Token, password, and confirm password are required'),
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        createErrorResponse('Password must be at least 6 characters long'),
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        createErrorResponse('Passwords do not match'),
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching reset token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Invalid or expired password reset token'),
        { status: 400 }
      );
    }

    // Update user password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Generate new JWT token for the user
    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified
    });

    // Return success response with user data and token
    return NextResponse.json(
      createSuccessResponse(
        'Password reset successful! You are now signed in.',
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
    console.error('Reset password error:', error);

    // Handle mongoose validation errors
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

// GET method for password reset via URL (when user clicks link in email)
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
        createErrorResponse('Reset token is required'),
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching reset token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Invalid or expired password reset token'),
        { status: 400 }
      );
    }

    // Return success response indicating token is valid
    return NextResponse.json(
      createSuccessResponse(
        'Reset token is valid. You can now reset your password.',
        {
          tokenValid: true,
          email: user.email // Return email for display purposes
        }
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password token validation error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}