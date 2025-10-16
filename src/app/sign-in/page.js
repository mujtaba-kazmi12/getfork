'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!showPasswordStep) {
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter a valid email address';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      // Password validation
      if (!formData.password.trim()) {
        newErrors.password = 'Please enter your password';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (validateForm()) {
      if (!showPasswordStep) {
        // Move to password step
        setShowPasswordStep(true);
      } else {
        // Handle final sign in
        setIsLoading(true);
        
        try {
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Store the token in localStorage
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Redirect to the process page
            router.push('/process');
          } else {
            setAuthError(data.message || 'Sign in failed');
          }
        } catch (error) {
          console.error('Sign in error:', error);
          setAuthError('Network error. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    console.log('Google sign in clicked');
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

  const handleResetPassword = () => {
    if (resetEmail.trim()) {
      // Handle reset password logic here
      console.log('Reset password for:', resetEmail);
      // Here you would typically send the reset email request to your API
      
      // Close the reset password modal and show success modal
      setShowForgotPasswordModal(false);
      setShowSuccessModal(true);
      setResetEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Sign In Form */}
      <div className="flex-1 lg:flex-1 flex flex-col">
        {/* Sign In Form Content */}
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
              Sign in to your account
            </h1>

            {/* Google Sign In Button - Only show during email step */}
            {!showPasswordStep && (
              <>
                <button
                  onClick={handleGoogleSignIn}
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
                  <span className="text-gray-700 font-medium">Sign in with Google</span>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!showPasswordStep ? (
                 /* Email Field Only */
                 <div>
                   <div className="relative">
                     <div className="absolute top-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                        : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                    }`}
                  />
                   </div>
                   {errors.email && (
                     <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                   )}
                 </div>
               ) : (
                 /* Both Email and Password Fields */
                 <div className="space-y-4">
                   {/* Email Field (Disabled) */}
                   <div>
                     <div className="relative">
                       <div className="absolute top-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <input
                         type="email"
                         name="email"
                         value={formData.email}
                         disabled
                         className="w-full h-10 pl-10 pr-3 border rounded-lg bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                       />
                     </div>
                   </div>

                   {/* Forgot Password Label */}
                   <div className="text-right">
                     <button 
                       type="button"
                       onClick={() => setShowForgotPasswordModal(true)}
                       className="text-sm text-orange-500 hover:text-orange-600"
                     >
                       Forgot password?
                     </button>
                   </div>

                   {/* Password Field */}
                   <div>
                     <div className="relative">
                       <div className="absolute top-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className={`w-full h-10 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500 text-gray-900' 
                        : 'border-gray-300 focus:ring-black focus:border-black text-gray-900'
                    }`}
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
                     {errors.password && (
                       <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                     )}
                   </div>
                 </div>
               )}

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-10 px-4 rounded-lg font-medium transition-colors mt-6 flex items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showPasswordStep ? 'Signing in...' : 'Continue'}
                  </>
                ) : (
                  showPasswordStep ? 'Sign In' : 'Continue'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <Link href="/sign-up" className="text-gray-900 font-medium hover:underline">
                Sign up
              </Link>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-8 text-xs text-gray-500 text-center">
              By continuing, you agree to Expertise&apos;s{' '}
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

      {/* Reset Password Modal */}
      {showForgotPasswordModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowForgotPasswordModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600 text-sm mb-6">
              Please enter the email you used to sign in with Getfork.
            </p>

            {/* Email Input */}
            <div className="mb-6">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900 placeholder-gray-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && resetEmail.trim()) {
                    handleResetPassword();
                  }
                }}
                autoFocus
              />
            </div>

            {/* Reset Password Button */}
            <button
              onClick={handleResetPassword}
              disabled={!resetEmail.trim()}
              className={`w-full h-10 rounded-lg font-medium transition-colors ${
                resetEmail.trim()
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Reset Password
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon and Message */}
            <div className="text-center mb-6">
              {/* Green Checkmark Icon */}
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-lg font-medium text-gray-900 mb-3">Email sent successfully!</h3>
              <p className="text-gray-600 text-sm">
                Check your email for a link to reset your password. If it doesn&apos;t appear within a few minutes, check your spam folder.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gray-900 text-white h-10 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}