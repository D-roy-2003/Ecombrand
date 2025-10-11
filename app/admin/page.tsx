'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentialsVerified, setCredentialsVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  
  // Forgot Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('')
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordOtpLoading, setForgotPasswordOtpLoading] = useState(false)
  const [forgotPasswordResendTimer, setForgotPasswordResendTimer] = useState(0)
  
  const router = useRouter()

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

  // Verify Admin Credentials and Send OTP
  const handleVerifyCredentials = async () => {
    if (!adminId || !password) {
      toast.error('Please enter Admin ID and password')
      return
    }

    setOtpLoading(true)

    try {
      const response = await fetch('/api/auth/admin/verify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setCredentialsVerified(true)
        setOtpSent(true)
        setAdminEmail(data.email)
        setResendTimer(60) // 1 minute timer
        toast.success('Credentials verified! OTP sent to your email address.')
      } else {
        if (response.status === 429) {
          setResendTimer(data.waitTime || 60)
        }
        toast.error(data.error || 'Failed to verify credentials')
      }
    } catch (error) {
      toast.error('Failed to verify credentials. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Verify OTP and Login
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setOtpVerifying(true)

    try {
      const response = await fetch('/api/auth/admin/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminEmail, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for authentication
        if (data.token) {
          localStorage.setItem('admin-token', data.token)
        }
        
        toast.success('OTP verified successfully! You are now logged in.')
        
        // Longer delay to ensure cookie is set properly
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 500)
      } else {
        toast.error(data.error || 'Invalid OTP')
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.')
    } finally {
      setOtpVerifying(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending`)
      return
    }
    
    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/admin/verify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendTimer(60)
        toast.success('OTP resent to your email address!')
      } else {
        toast.error(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Forgot Password handlers
  const handleForgotPasswordSendOTP = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address')
      return
    }

    setForgotPasswordOtpLoading(true)

    try {
      const response = await fetch('/api/auth/admin/forgot-password', {
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
      const response = await fetch('/api/auth/admin/forgot-password/verify', {
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
          localStorage.setItem('admin-token', data.token)
        }
        
        toast.success('OTP verified successfully! You are now logged in.')
        
        // Longer delay to ensure cookie is set properly
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
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
    
    if (!credentialsVerified) {
      // First step: verify credentials
      await handleVerifyCredentials()
    } else {
      // Second step: verify OTP
      await handleVerifyOTP()
    }
  }

  const resetForm = () => {
    setAdminId('')
    setPassword('')
    setOtp('')
    setCredentialsVerified(false)
    setOtpSent(false)
    setAdminEmail('')
    setResendTimer(0)
  }

  const handleOldLogin = async () => {
    // Fallback to old email-based login (temporary)
    if (!adminId || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for authentication
        if (data.token) {
          localStorage.setItem('admin-token', data.token)
        }
        
        toast.success('Admin login successful!')
        router.push('/admin/dashboard')
      } else {
        toast.error(data.error || 'Admin login failed')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl font-display font-bold text-gradient">
            EDGY FASHION
          </span>
          <p className="text-gray-400 mt-2">Admin Portal</p>
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
              ADMIN ACCOUNT RECOVERY
            </h2>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your admin email address"
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
                      🔐 We've sent a 6-digit OTP to your admin email address. 
                      Enter the code above to verify your identity and access your admin account.
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
                  ← Back to Admin Login
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
                <Shield className="w-8 h-8 text-accent-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-8">
              ADMIN LOGIN
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin ID Field */}
              <div>
                <label htmlFor="adminId" className="block text-sm font-medium text-gray-300 mb-2">
                  Admin ID
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="adminId"
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 text-white rounded-lg focus:border-accent-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your Admin ID"
                    required
                    disabled={credentialsVerified}
                  />
                  {credentialsVerified && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

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
                    placeholder="Enter admin password"
                    required
                    disabled={credentialsVerified}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    disabled={credentialsVerified}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {credentialsVerified && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Forgot Password Link */}
                {!credentialsVerified && (
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

              {/* OTP Field (after credentials are verified) */}
              {credentialsVerified && otpSent && (
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
                      />
                    </div>
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
                      📧 We've sent a 6-digit verification code to your admin email address. 
                      Please check your inbox and enter the code above to complete your login.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={otpLoading || otpVerifying || (credentialsVerified && otp.length !== 6)}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Verifying Credentials...' : 
                 otpVerifying ? 'Verifying OTP...' :
                 credentialsVerified ? 'VERIFY OTP & LOGIN' : 'VERIFY & SEND OTP'}
              </button>
            </form>

            {/* Reset Form */}
            {credentialsVerified && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}


        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Edgy Fashion. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
