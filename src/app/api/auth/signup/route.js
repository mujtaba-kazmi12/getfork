import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import { createErrorResponse, createSuccessResponse, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { name, email, phone, password } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        createErrorResponse('All fields are required'),
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

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        createErrorResponse('Please enter a valid email address'),
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        createErrorResponse('Please enter a valid phone number'),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          createErrorResponse('User with this email already exists'),
          { status: 409 }
        );
      }
      if (existingUser.phone === phone) {
        return NextResponse.json(
          createErrorResponse('User with this phone number already exists'),
          { status: 409 }
        );
      }
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      isVerified: false
    });

    // Generate verification token
    const verificationToken = user.createVerificationToken();

    // Save user to database
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration if email fails, but log it
      // In production, you might want to queue this for retry
    }

    // Generate JWT token (even if not verified yet)
    const token = generateToken({
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified,
    });

    // Return success response with user data and token
    return NextResponse.json(
      createSuccessResponse(
        'Account created successfully! Please check your email to verify your account.',
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
          },
          token,
        }
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        createErrorResponse(messages.join(', ')),
        { status: 400 }
      );
    }

    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        createErrorResponse(`User with this ${field} already exists`),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}