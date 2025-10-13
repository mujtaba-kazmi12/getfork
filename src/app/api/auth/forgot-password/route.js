import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import { createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        createErrorResponse('Email is required'),
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

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    // Always return success message for security reasons
    // Don't reveal if email exists or not
    const successMessage = 'If an account with that email exists, we have sent a password reset link to your email address.';

    if (!user) {
      return NextResponse.json(
        createSuccessResponse(successMessage),
        { status: 200 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        createErrorResponse('Please verify your email address first before requesting a password reset.'),
        { status: 403 }
      );
    }

    // Generate password reset token
    const resetToken = user.createPasswordResetToken();

    // Save user with reset token
    await user.save({ validateBeforeSave: false });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        createErrorResponse('Failed to send password reset email. Please try again later.'),
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      createSuccessResponse(successMessage),
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);

    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}