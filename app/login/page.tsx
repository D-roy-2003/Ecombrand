'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, ShoppingCart, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { setCurrentUserId } from '@/lib/cart'
function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Forgot Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('')
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordOtpLoading, setForgotPasswordOtpLoading] = useState(false)
  const [forgotPasswordResendTimer, setForgotPasswordResendTimer] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [alertMessage, setAlertMessage] = useState<{ type: 'cart' | 'wishlist' | null; show: boolean }>({ type: null, show: false })
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for alert message on component mount
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'cart' || message === 'wishlist') {
      setAlertMessage({ type: message as 'cart' | 'wishlist', show: true })
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setAlertMessage(prev => ({ ...prev, show: false }))
      }, 5000)
    }
  }, [searchParams])

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Timer for Forgot Password OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (forgotPasswordResendTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [forgotPasswordResendTimer])

  // Reset OTP state when switching between login/register
  useEffect(() => {
    setOtpSent(false)
    setOtpVerified(false)
    setOtp('')
    setResendTimer(0)
  }, [isLogin])

  const handleSendOTP = async () => {
    if (!email || !name) {
      toast.error('Please enter your name and email first')
      return
    }

    setOtpLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setResendTimer(60) // 1 minute timer
        toast.success('OTP sent to your email address!')
      } else {
        if (response.status === 429) {
          setResendTimer(data.waitTime || 60)
        }
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setOtpVerifying(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpVerified(true)
        toast.success('Email verified successfully!')
      } else {
        toast.error(data.error || 'Invalid OTP')
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.')
    } finally {
      setOtpVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending`)
      return
    }
    await handleSendOTP()
  }

  // Forgot Password handlers
  const handleForgotPasswordSendOTP = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address')
      return
    }

    setForgotPasswordOtpLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setForgotPasswordOtpSent(true)
        setForgotPasswordResendTimer(60) // 1 minute timer
        toast.success('Login OTP sent to your email address!')
      } else {
        if (response.status === 429) {
          setForgotPasswordResendTimer(data.waitTime || 60)
        }
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setForgotPasswordOtpLoading(false)
    }
  }

  const handleForgotPasswordVerifyOTP = async () => {
    if (!forgotPasswordOtp || forgotPasswordOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setForgotPasswordLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail, otp: forgotPasswordOtp }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for authentication
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        
        // Set user ID for cart system
        if (data.user && data.user.id) {
          setCurrentUserId(data.user.id)
        }
        
        toast.success('OTP verified successfully! You are now logged in.')
        
        // Add debugging
        console.log('User data:', data.user)
        console.log('Token stored:', data.token)
        
        // Longer delay to ensure cookie is set properly
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          // Redirect based on user role
          if (data.user.role === 'ADMIN') {
            window.location.href = '/admin/dashboard'
          } else {
            window.location.href = '/user/dashboard'
          }
        }, 500)
      } else {
        toast.error(data.error || 'Invalid OTP')
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleForgotPasswordResendOTP = async () => {
    if (forgotPasswordResendTimer > 0) {
      toast.error(`Please wait ${forgotPasswordResendTimer} seconds before resending`)
      return
    }
    await handleForgotPasswordSendOTP()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!isLogin && !name) {
      toast.error('Please enter your name')
      return
    }

    // For registration, check if OTP is verified
    if (!isLogin && !otpVerified) {
      toast.error('Please verify your email with OTP first')
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          ...(isLogin ? {} : { name, otp }) 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for authentication
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        
        // Set user ID for cart system
        if (data.user && data.user.id) {
          setCurrentUserId(data.user.id)
        }
        
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!')
        
        // Redirect based on user role
        if (data.user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/user/dashboard')
        }
      } else {
        toast.error(data.error || (isLogin ? 'Login failed' : 'Registration failed'))
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const dismissAlert = () => {
    setAlertMessage(prev => ({ ...prev, show: false }))
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Alert Message */}
        {alertMessage.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg border-l-4 shadow-lg"
            style={{
              backgroundColor: '#1f2937',
              borderLeftColor: '#f59e0b',
              border: '1px solid #374151'
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {alertMessage.type === 'cart' ? (
                  <ShoppingCart className="w-6 h-6 text-amber-400" />
                ) : (
                  <Heart className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-white">
                  {alertMessage.type === 'cart' ? 'Login Required for Cart' : 'Login Required for Wishlist'}
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  {alertMessage.type === 'cart' 
                    ? 'Please log in to add products to your cart and continue shopping.' 
                    : 'Please log in to add products to your wishlist and save your favorites.'
                  }
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={dismissAlert}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl font-display font-bold text-gradient">
            ROT KIT
          </span>
          <p className="text-gray-400 mt-2">Welcome Back</p>
        </div>

        {/* Forgot Password Modal */}
        {isForgotPassword && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-primary-900 border border-primary-800 rounded-lg p-8 mb-6"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-red-600/20 rounded-lg">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-8">
              FORGOT PASSWORD
            </h2>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your email address"
                    disabled={forgotPasswordOtpSent}
                  />
                </div>
                
                {/* Send OTP Button */}
                {!forgotPasswordOtpSent && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleForgotPasswordSendOTP}
                      disabled={forgotPasswordOtpLoading || !forgotPasswordEmail}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotPasswordOtpLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                )}
              </div>

              {/* OTP Field (after OTP is sent) */}
              {forgotPasswordOtpSent && (
                <div>
                  <label htmlFor="forgotOtp" className="block text-sm font-medium text-gray-300 mb-2">
                    OTP Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="forgotOtp"
                        type="text"
                        value={forgotPasswordOtp}
                        onChange={(e) => setForgotPasswordOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300 text-center text-lg tracking-widest"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                    
                    {/* Verify Button */}
                    {forgotPasswordOtp.length === 6 && (
                      <button
                        type="button"
                        onClick={handleForgotPasswordVerifyOTP}
                        disabled={forgotPasswordLoading}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {forgotPasswordLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    )}
                  </div>
                  
                  {/* Resend OTP */}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Didn't receive the code?
                    </span>
                    <button
                      type="button"
                      onClick={handleForgotPasswordResendOTP}
                      disabled={forgotPasswordResendTimer > 0}
                      className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {forgotPasswordResendTimer > 0 ? `Resend in ${forgotPasswordResendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                  
                  {/* Info */}
                  <div className="mt-2 p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                    <p className="text-red-300 text-xs">
                      🔐 We've sent a 6-digit OTP to your email address. 
                      Enter the code above to verify your identity and access your account.
                    </p>
                  </div>
                </div>
              )}

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false)
                    setForgotPasswordEmail('')
                    setForgotPasswordOtp('')
                    setForgotPasswordOtpSent(false)
                    setForgotPasswordResendTimer(0)
                  }}
                  className="text-accent-500 hover:text-accent-400 transition-colors duration-200"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        {!isForgotPassword && (
          <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-accent-600/20 rounded-lg">
              <User className="w-8 h-8 text-accent-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (only for registration) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              {/* Send OTP Button (only for registration) */}
              {!isLogin && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || !email || !name || otpSent}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      otpSent 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : 'bg-accent-600 hover:bg-accent-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {otpLoading ? 'Sending OTP...' : otpSent ? '✓ OTP Sent' : 'Send OTP'}
                  </button>
                  
                  {/* Verified checkmark */}
                  {otpVerified && (
                    <div className="flex items-center justify-center w-10 h-8 bg-green-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* OTP Field (only for registration and after OTP is sent) */}
            {!isLogin && otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300 text-center text-lg tracking-widest"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                      disabled={otpVerified}
                    />
                  </div>
                  
                  {/* Verify Button - only show when OTP is entered and not verified */}
                  {otp.length === 6 && !otpVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpVerifying}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                  
                  {/* Verified checkmark */}
                  {otpVerified && (
                    <div className="flex items-center justify-center px-4 py-3 bg-green-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Resend OTP */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Didn't receive the code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className="text-accent-500 hover:text-accent-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
                
                {/* OTP Info */}
                <div className="mt-2 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <p className="text-blue-300 text-xs">
                    📧 We've sent a 6-digit verification code to your email address. 
                    Please check your inbox and enter the code above to verify your email.
                  </p>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Forgot Password Link (only for login) */}
              {isLogin && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-accent-500 hover:text-accent-400 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Login/Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent-500 hover:text-accent-400 transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            2024 Edgy Fashion. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  )
}