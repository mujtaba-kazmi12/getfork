'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function SignUpPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: 'Hi! I\'m here to help you with anything. What would you like to know?' }
  ]);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      router.push('/process');
    }
  }, [router]);

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
    setPasswordValidation(validation);
    return validation;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate password in real-time
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMessage('');
    
    if (!showPasswordStep) {
      // First step: validate basic form fields
      if (validateForm()) {
        setShowPasswordStep(true);
      }
    } else {
      // Second step: validate password and complete registration
      const passwordValid = validatePassword(formData.password);
      const allPasswordRequirementsMet = Object.values(passwordValid).every(Boolean);
      
      if (allPasswordRequirementsMet) {
        setIsLoading(true);
        
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Store auth token and user info in localStorage
            if (data?.data?.token) {
              localStorage.setItem('authToken', data.data.token);
            }
            if (data?.data?.user) {
              localStorage.setItem('userData', JSON.stringify(data.data.user));
            }

            showToast(data.message || 'Registration successful! Please check your email to verify your account.', 'success');
            
            // Redirect to process page after a short delay
            setTimeout(() => {
              router.push('/process');
            }, 1500);
          } else {
            showToast(data.message || 'Registration failed', 'error');
          }
        } catch (error) {
          console.error('Registration error:', error);
          showToast('Network error. Please try again.', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log('Google sign up clicked');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
      // Simulate bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { type: 'bot', message: 'Thanks for your message! I\'m here to help you with GetFork.ai.' }]);
      }, 1000);
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Sign Up Form */}
      <div className="flex-1 lg:flex-1 flex flex-col">
        {/* Sign Up Form Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <Image 
              src="/GetforkLogo.svg" 
              alt="Getfork.ai" 
              width={180}
              height={42}
              className="h-8"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            Create an account
          </h1>

          {/* Google Sign Up Button - Hidden during password step */}
          {!showPasswordStep && (
            <>
              <button
                onClick={handleGoogleSignUp}
                className="w-full h-10 flex items-center justify-center space-x-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Sign up with Google</span>
              </button>

              {/* OR Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
            </>
          )}

          {/* Error Display */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

          {/* Success Display */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${showPasswordStep ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    disabled={showPasswordStep}
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      showPasswordStep 
                        ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed placeholder-gray-400'
                        : errors.firstName 
                          ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                          : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    disabled={showPasswordStep}
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      showPasswordStep 
                        ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed placeholder-gray-400'
                        : errors.lastName 
                          ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                          : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${showPasswordStep ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  disabled={showPasswordStep}
                  className={`w-full h-10 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    showPasswordStep 
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed placeholder-gray-400'
                      : errors.email 
                        ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                        : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${showPasswordStep ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  disabled={showPasswordStep}
                  className={`w-full h-10 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    showPasswordStep 
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed placeholder-gray-400'
                      : errors.phone 
                        ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                        : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password Field - Only show when in password step */}
            {showPasswordStep && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full h-10 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            {/* Password Validation Indicators - Only show when in password step */}
            {showPasswordStep && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  {passwordValidation.minLength ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                    At least 12 characters
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {passwordValidation.uppercase ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                    One uppercase letter
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {passwordValidation.lowercase ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                    One lowercase letter
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {passwordValidation.number ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-sm ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
                    One number
                  </span>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-10 px-4 rounded-lg font-medium transition-colors mt-6 flex items-center justify-center bg-gray-900 text-white ${
                isLoading 
                  ? 'cursor-not-allowed' 
                  : 'hover:bg-gray-800'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                showPasswordStep ? 'Create Account' : 'Continue'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/sign-in" className="text-gray-900 font-medium hover:underline">
              Log in
            </Link>
          </div>

            {/* Terms and Privacy */}
            <div className="mt-8 text-xs text-gray-500 text-center">
              By continuing, you agree to GetFork&apos;s{' '}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Simple Input Widget - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Simple Input Widget */}
          <div className="bg-white border-2 border-orange-500 px-6 py-4 rounded-full shadow-lg flex items-center space-x-3 cursor-pointer hover:shadow-orange-200 hover:shadow-xl transition-all duration-300 focus-within:ring-4 focus-within:ring-orange-200 focus-within:border-orange-600">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleChatSubmit(e);
                }
              }}
            />
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}