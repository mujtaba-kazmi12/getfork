import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        createErrorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        createErrorResponse('Please enter a valid email address'),
        { status: 400 }
      );
    }

    // Find user by email and include password field
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        createErrorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    // Check if user email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        createErrorResponse('Please verify your email address before signing in. Check your email for verification link.'),
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified
    });

    // Update last login (optional)
    user.lastLogin = new Date();
    await user.save();

    // Return success response with user data and token
    return NextResponse.json(
      createSuccessResponse(
        'Sign in successful',
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
          token
        }
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign in error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}