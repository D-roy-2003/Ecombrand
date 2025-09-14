'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

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

// Country codes data - 10 popular countries
const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+91', country: 'IN', flag: '🇮🇳' }
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Add profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '+1',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    profileImage: ''
  })

  // State for country code dropdown
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false)
  
  // Ref for country code dropdown
  const countryCodeRef = useRef<HTMLDivElement>(null)

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  // Update profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        countryCode: user.countryCode || '+1',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
        profileImage: user.profileImage || ''
      })
    }
  }, [user])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryCodeRef.current && !countryCodeRef.current.contains(event.target as Node)) {
        setIsCountryCodeOpen(false)
      }
    }

    if (isCountryCodeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryCodeOpen])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      } else {
        // If not authenticated, redirect to login
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load user data')
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

  const goHome = () => {
    router.push('/')
  }

  // Add profile picture upload function
  const handleProfileImageUpload = async (file: File) => {
    try {
      console.log('Starting upload for file:', file.name)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'users')

      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Upload successful, URL:', data.url)
        
        // Update local state immediately
        setProfileData(prev => {
          console.log('Updating profileData with:', data.url)
          return { ...prev, profileImage: data.url }
        })
        setUser(prev => {
          console.log('Updating user with:', data.url)
          return prev ? { ...prev, profileImage: data.url } : null
        })
        
        // Save to database
        const saveResponse = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileImage: data.url }),
          credentials: 'include'
        })
        
        if (saveResponse.ok) {
          toast.success('Profile picture uploaded and saved successfully!')
        } else {
          toast.error('Image uploaded but failed to save to database')
        }
      } else {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        toast.error('Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast.error('Failed to upload profile picture')
    }
  }

  // Handle phone number input with 10-digit validation
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '')
    
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      setProfileData(prev => ({ ...prev, phoneNumber: digitsOnly }))
    }
  }

  // Update the handleProfileUpdate function
  const handleProfileUpdate = async () => {
    try {
      // Validate phone number before saving
      if (profileData.phoneNumber && profileData.phoneNumber.length !== 10) {
        toast.error('Phone number must be exactly 10 digits')
        return
      }

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include'
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access your dashboard</div>
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
              <span className="text-2xl font-display font-bold text-gradient">
                ROT KIT
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-white font-medium">My Account</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Home Button */}
              <button
                onClick={goHome}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-primary-800"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(user.name)
                  )}
                </div>
                <span className="text-gray-300 text-sm">{user.name}</span>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-600/20"
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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
                    </div>
                    <Package className="w-8 h-8 text-accent-500" />
                  </div>
                </div>
                
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-white">${stats?.totalSpent?.toFixed(2) || '0.00'}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-accent-500" />
                  </div>
                </div>
                
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Wishlist Items</p>
                      <p className="text-2xl font-bold text-white">{stats?.wishlistItems || 0}</p>
                    </div>
                    <Heart className="w-8 h-8 text-accent-500" />
                  </div>
                </div>
                
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Loyalty Points</p>
                      <p className="text-2xl font-bold text-white">{stats?.loyaltyPoints || 0}</p>
                    </div>
                    <Star className="w-8 h-8 text-accent-500" />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-primary-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Order #{order.id.slice(-8)}</p>
                            <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${order.totalPrice.toFixed(2)}</p>
                          <p className={`text-sm ${
                            order.status === 'DELIVERED' ? 'text-green-400' :
                            order.status === 'SHIPPED' ? 'text-blue-400' :
                            order.status === 'PROCESSING' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No orders yet</p>
                    <button 
                      onClick={() => router.push('/shop')}
                      className="mt-4 bg-accent-600 hover:bg-accent-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab - Updated to match admin UI */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-r from-primary-900 to-primary-800 border border-primary-700 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-accent-600/20 rounded-lg">
                    <User className="w-8 h-8 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Details</h2>
                    <p className="text-gray-400">Manage your personal information and profile</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Profile Picture */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary-800 rounded-full flex items-center justify-center border-2 border-primary-700 overflow-hidden">
                          {(profileData.profileImage || user?.profileImage) ? (
                            <img 
                              src={profileData.profileImage || user?.profileImage} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', profileData.profileImage || user?.profileImage)
                                e.currentTarget.style.display = 'none'
                              }}
                              onLoad={() => console.log('Image loaded successfully:', profileData.profileImage || user?.profileImage)}
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleProfileImageUpload(file)
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="absolute -bottom-2 -right-2 p-2 bg-accent-600 hover:bg-accent-700 rounded-full transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div>
                        <button 
                          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                          className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
                        >
                          Upload Photo
                        </button>
                        <p className="text-sm text-gray-400 mt-2">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Personal Information */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileData.name.split(' ')[0] || ''}
                          onChange={(e) => {
                            const lastName = profileData.name.split(' ').slice(1).join(' ')
                            setProfileData(prev => ({ ...prev, name: `${e.target.value} ${lastName}`.trim() }))
                          }}
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileData.name.split(' ').slice(1).join(' ') || ''}
                          onChange={(e) => {
                            const firstName = profileData.name.split(' ')[0] || ''
                            setProfileData(prev => ({ ...prev, name: `${firstName} ${e.target.value}`.trim() }))
                          }}
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>

                    {/* Country Code and Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <div className="flex gap-2">
                        {/* Country Code Dropdown */}
                        <div className="relative" ref={countryCodeRef}>
                          <button
                            type="button"
                            onClick={() => setIsCountryCodeOpen(!isCountryCodeOpen)}
                            className="flex items-center gap-2 px-3 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white hover:bg-primary-700 transition-colors min-w-[100px]"
                          >
                            <span className="text-lg">
                              {countryCodes.find(cc => cc.code === profileData.countryCode)?.flag || '🇺🇸'}
                            </span>
                            <span className="text-sm">
                              {profileData.countryCode}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          
                          {isCountryCodeOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-primary-800 border border-primary-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {countryCodes.map((country, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setProfileData(prev => ({ ...prev, countryCode: country.code }))
                                    setIsCountryCodeOpen(false)
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-primary-700 transition-colors"
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm font-medium">{country.code}</span>
                                  <span className="text-sm text-gray-400">{country.country}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={handlePhoneNumberChange}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                          className={`flex-1 px-4 py-3 bg-primary-800 border rounded-lg text-white focus:outline-none ${
                            profileData.phoneNumber && profileData.phoneNumber.length !== 10
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-primary-700 focus:border-accent-500'
                          }`}
                        />
                      </div>
                      {profileData.phoneNumber && profileData.phoneNumber.length !== 10 && (
                        <p className="text-red-400 text-sm mt-1">
                          Phone number must be exactly 10 digits
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                        <input
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="Enter state"
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={profileData.zipCode}
                          onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                          placeholder="Enter ZIP code"
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileData.country}
                          onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Enter country"
                          className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={handleProfileUpdate}
                        className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setProfileData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phoneNumber: user?.phoneNumber || '',
                          countryCode: user?.countryCode || '+1',
                          address: user?.address || '',
                          city: user?.city || '',
                          state: user?.state || '',
                          zipCode: user?.zipCode || '',
                          country: user?.country || '',
                          profileImage: user?.profileImage || ''
                        })}
                        className="px-6 py-3 border border-primary-700 hover:border-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs content */}
          {activeTab === 'orders' && (
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Orders</h3>
              <p className="text-gray-400">Order management coming soon...</p>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Wishlist</h3>
              <p className="text-gray-400">Wishlist management coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
              <p className="text-gray-400">Settings management coming soon...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 