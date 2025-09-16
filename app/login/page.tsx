'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, ShoppingCart, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { setCurrentUserId } from '@/lib/cart'

export default function UserLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
          ...(isLogin ? {} : { name }) 
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
            EDGY FASHION
          </span>
          <p className="text-gray-400 mt-2">Welcome Back</p>
        </div>

        {/* Login Form */}
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