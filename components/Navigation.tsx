'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut,
  ChevronDown,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Define user type
interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        setIsUserMenuOpen(false)
        toast.success('Logged out successfully!')
        
        // Force reload to clear all state
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const goToDashboard = () => {
    setIsUserMenuOpen(false)
    router.push('/user/dashboard')
  }

  const goToLogin = () => {
    router.push('/login')
  }

  // Generate user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="bg-primary-900 border-b border-primary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-gradient">
              ROT
            </span>
            <span className="text-xl font-display font-medium text-white">
              KIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300">
              Home
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-300">
              Shop
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
              Contact
            </Link>
          </div>

          {/* Right side - Cart, Wishlist and User */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="text-gray-300 hover:text-white transition-colors duration-300" title="Shopping Cart">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="text-gray-300 hover:text-white transition-colors duration-300" title="Wishlist">
              <Heart className="w-6 h-6" />
            </Link>

            {/* User Menu - Fixed width container to prevent layout shift */}
            <div className="relative w-24 flex justify-end" ref={dropdownRef}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary-700 animate-pulse"></div>
                  <div className="w-4 h-4 bg-primary-700 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-primary-800"
                  >
                    <div className="h-8 w-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold text-sm">
                      {getUserInitials(user.name)}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-primary-800 border border-primary-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="py-3">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-primary-700 bg-primary-900">
                              <p className="text-white font-semibold text-sm">{user.name}</p>
                              <p className="text-gray-400 text-xs truncate">{user.email}</p>
                            </div>
                            
                            {/* Menu Items */}
                            <div className="py-2">
                              <button
                                onClick={goToDashboard}
                                className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-primary-700 transition-all duration-200 flex items-center space-x-3 group"
                              >
                                <User className="w-4 h-4 group-hover:text-accent-400 transition-colors" />
                                <span className="text-sm font-medium">My Account</span>
                              </button>
                              
                              <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 flex items-center space-x-3 group"
                              >
                                <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                                <span className="text-sm font-medium">Logout</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={goToLogin}
                    className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                  >
                    Login
                  </button>
                )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
