'use client'

import { useState, useEffect } from 'react'
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
  Home
} from 'lucide-react'
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

interface Stats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  loyaltyPoints: number
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
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
        setRecentOrders(data.recentOrders)
      } else {
        // If not authenticated, redirect to login
        router.push('/admin')
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
                <div className="h-8 w-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials(user.name)}
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

          {/* Other tabs content would go here */}
          {activeTab === 'profile' && (
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name</label>
                  <input 
                    type="text" 
                    value={user.name}
                    className="w-full bg-primary-800 border border-primary-700 text-white rounded-lg px-4 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user.email}
                    className="w-full bg-primary-800 border border-primary-700 text-white rounded-lg px-4 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Member Since</label>
                  <input 
                    type="text" 
                    value={new Date(user.createdAt).toLocaleDateString()}
                    className="w-full bg-primary-800 border border-primary-700 text-white rounded-lg px-4 py-2"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 