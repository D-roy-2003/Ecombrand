'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  Heart,
  User,
  Settings,
  LogOut,
  Eye,
  Star,
  Truck,
  CreditCard,
  MapPin,
  Bell,
  Home,
  Camera,
  ChevronDown,
  Trash2,
  ShoppingBag,
  Lock,
  EyeOff,
  Plus,
  Minus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useWishlist } from '@/lib/useWishlist'
import { addToCart, readCart, writeCart, CartItem, updateQuantity, removeFromCart, isUserAuthenticated, setCurrentUserId, clearAllCartData, getCartItems, getCartTotal } from '@/lib/cart'

// Define user type
interface User {
  id: string
  name: string
  email: string
  role: string
  phoneNumber?: string
  countryCode?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  profileImage?: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  loyaltyPoints: number
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalSpent: 0, wishlistItems: 0, loyaltyPoints: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    profileImage: ''
  })
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)
  const countryCodeRef = useRef<HTMLDivElement>(null)

  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+61', country: 'Australia' },
    { code: '+55', country: 'Brazil' },
    { code: '+7', country: 'Russia' },
    { code: '+82', country: 'South Korea' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' }
  ]

  const { wishlist, addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist()

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        countryCode: user.countryCode || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
        profileImage: user.profileImage || ''
      })
    }
  }, [user])

  // Load cart items when cart tab is active
  useEffect(() => {
    if (activeTab === 'cart') {
      loadCartItems()
    }
  }, [activeTab])

  // Close country code dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryCodeRef.current && !countryCodeRef.current.contains(event.target as Node)) {
        setIsCountryCodeOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setStats(data.stats)
        setCurrentUserId(data.user.id)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadCartItems = async () => {
    setCartLoading(true)
    try {
      const items = await getCartItems()
      const total = await getCartTotal()
      setCartItems(items)
      setCartTotal(total)
    } catch (error) {
      console.error('Error loading cart items:', error)
      toast.error('Failed to load cart items')
    } finally {
      setCartLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        clearAllCartData()
        setCurrentUserId(null)
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

  const goHome = () => {
    window.location.href = '/'
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update both profileData and user state
        setProfileData(prev => ({ ...prev, profileImage: data.imageUrl }))
        setUser(prev => prev ? { ...prev, profileImage: data.imageUrl } : null)
        
        toast.success('Profile image updated successfully!')
      } else {
        toast.error('Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      toast.error('Failed to upload profile picture')
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 10) {
      setProfileData(prev => ({ ...prev, phoneNumber: value }))
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        fetchUserData() // Refresh user data
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    const result = await addToCart({
      id: productId,
      name: '',
      price: 0,
      imageUrl: ''
    }, 1)
    
    if (result.success) {
      toast.success('Added to cart!')
      loadCartItems() // Refresh cart items
    } else if (result.requiresLogin) {
      toast.error('Please login to add products to the cart')
    } else {
      toast.error(result.message || 'Failed to add to cart')
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const success = await removeFromWishlist(productId)
      if (success) {
        toast.success('Removed from wishlist')
        await fetchWishlist()
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
      await loadCartItems()
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId)
      toast.success('Removed item from cart')
      await loadCartItems()
    } catch (error) {
      console.error('Error removing item from cart:', error)
      toast.error('Failed to remove item')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in</h1>
          <button 
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-primary-900 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">ROT KIT</h1>
              <div className="h-6 w-px bg-primary-700"></div>
              <h2 className="text-lg text-gray-300">My Account</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={goHome}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
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
                <span className="text-white font-medium">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-primary-900 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'cart', label: 'Cart', icon: ShoppingCart },
            { id: 'profile', label: 'Profile', icon: Settings },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-primary-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-600/20 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-white">₹{stats.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-600/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Wishlist Items</p>
                    <p className="text-2xl font-bold text-white">{wishlist.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-600/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Loyalty Points</p>
                    <p className="text-2xl font-bold text-white">{stats.loyaltyPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-600/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Orders</h3>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">No orders yet</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              <Link
                href="/cart"
                className="text-accent-400 hover:text-accent-300 transition-colors duration-200"
              >
                View Full Cart →
              </Link>
            </div>

            {cartLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">Your cart is empty</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-primary-900 border border-primary-800 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-primary-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-accent-400 font-semibold">
                          ₹{item.price}
                        </p>
                        {item.selectedSize && (
                          <p className="text-xs text-gray-400 mt-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full bg-primary-700 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-8 text-center text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-primary-700 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-white font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {cartItems.length > 3 && (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      And {cartItems.length - 3} more items...
                    </p>
                    <Link
                      href="/cart"
                      className="btn-primary"
                    >
                      View All Items
                    </Link>
                  </div>
                )}

                {/* Cart Summary */}
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-accent-400">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/cart"
                    className="w-full btn-primary text-center block"
                  >
                    Go to Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Wishlist</h2>
            
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">Your wishlist is empty</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-primary-900 border border-primary-800 rounded-lg p-4">
                    <div className="aspect-square bg-primary-700 rounded-lg overflow-hidden mb-4">
                      <img
                        src={item.product.imageUrls[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-medium mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-accent-400 font-bold text-lg">
                        ₹{item.product.price}
                      </span>
                      {item.product.discount && item.product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item.product.id)}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        ADD TO CART
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        className="px-3 py-2 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-200 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-accent-400 flex items-center justify-center text-white font-bold text-2xl">
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
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-700 transition-colors duration-200">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country Code
                  </label>
                  <div className="relative" ref={countryCodeRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryCodeOpen(!isCountryCodeOpen)}
                      className="w-full input-field text-left flex items-center justify-between"
                    >
                      <span>{profileData.countryCode || 'Select Country'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {isCountryCodeOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-primary-800 border border-primary-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              setProfileData(prev => ({ ...prev, countryCode: country.code }))
                              setIsCountryCodeOpen(false)
                            }}
                            className="w-full px-4 py-2 text-left text-white hover:bg-primary-700 transition-colors duration-200"
                          >
                            {country.code} - {country.country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="10-digit phone number"
                    className="w-full input-field"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full input-field"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleProfileUpdate}
                  className="btn-primary"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 