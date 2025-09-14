'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { getCartCount, isUserAuthenticated, clearAllCartData } from '@/lib/cart'
import toast from 'react-hot-toast'
import { FlyingHeartProvider } from '@/lib/FlyingHeartContext'

interface User {
  id: string
  name: string
  email: string
  role: string
  profileImage?: string
}

export default function Navigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isWishlistGlowing, setIsWishlistGlowing] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  // Refresh cart count when user changes
  useEffect(() => {
    if (user) {
      loadCartCount()
    } else {
      setCartCount(0)
    }
  }, [user])

  const fetchUserData = async () => {
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
      console.error('Error fetching user data:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loadCartCount = async () => {
    try {
      const count = await getCartCount()
      setCartCount(count)
    } catch (error) {
      console.error('Error loading cart count:', error)
      setCartCount(0)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        setCartCount(0)
        clearAllCartData()
        toast.success('Logged out successfully')
        router.push('/')
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const getUserInitials = (name: string): string => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Listen for flying heart completion
  useEffect(() => {
    const handleFlyingHeartComplete = () => {
      setIsWishlistGlowing(true)
      setTimeout(() => setIsWishlistGlowing(false), 1000)
    }

    window.addEventListener('flyingHeartComplete', handleFlyingHeartComplete)
    return () => window.removeEventListener('flyingHeartComplete', handleFlyingHeartComplete)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-primary-900/95 backdrop-blur-sm border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-accent-400">ROT</span>
              <span className="text-white">KIT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-200">
              Shop
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`p-2 text-gray-300 hover:text-white transition-colors duration-200 ${
                isWishlistGlowing ? 'text-red-500' : ''
              }`}
            >
              <motion.div
                animate={isWishlistGlowing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className={`w-6 h-6 ${isWishlistGlowing ? 'fill-red-500' : ''}`} />
              </motion.div>
            </Link>

            {/* User Profile */}
            {loading ? (
              <div className="w-8 h-8 bg-primary-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-accent-400 flex items-center justify-center text-white font-semibold text-sm">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(user.name)
                  )}
                </button>
                
                {/* User Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-primary-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-primary-700">
                      <p className="text-sm text-white font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-primary-800 bg-primary-900"
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-primary-800">
              <Link
                href="/cart"
                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-6 h-6" />
              </Link>
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-accent-400 flex items-center justify-center text-white font-semibold text-sm">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials(user.name)
                    )}
                  </div>
                  <span className="text-white text-sm">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
