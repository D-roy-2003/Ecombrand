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

interface Order {
  id: string
  totalPrice: number
  status: string
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    sizes: string
    product: {
      id: string
      name: string
      imageUrls: string[]
      category: string
    }
  }[]
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalSpent: 0, wishlistItems: 0, loyaltyPoints: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null)

  const { wishlist, addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist()

  useEffect(() => {
    fetchUserData()
  }, [])

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab])

  // Load cart items when cart tab is active
  useEffect(() => {
    if (activeTab === 'cart') {
      loadCartItems()
    }
  }, [activeTab])

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

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setOrdersLoading(false)
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

  const handleTrackOrder = (order: Order) => {
    setSelectedOrderForTracking(order)
    setShowTrackingModal(true)
  }

  const getTrackingSteps = (status: string) => {
    const steps = [
      { id: 'placed', label: 'Order Placed', completed: true },
      { id: 'packed', label: 'Order Packed', completed: false },
      { id: 'transit', label: 'In Transit', completed: false },
      { id: 'delivery', label: 'Out for delivery', completed: false },
      { id: 'delivered', label: 'Delivered', completed: false }
    ]

    switch (status) {
      case 'PENDING':
        return steps
      case 'PROCESSING':
        steps[1].completed = true
        return steps
      case 'SHIPPED':
        steps[1].completed = true
        steps[2].completed = true
        return steps
      case 'OUT_FOR_DELIVERY':
        steps[1].completed = true
        steps[2].completed = true
        steps[3].completed = true
        return steps
      case 'DELIVERED':
        return steps.map(step => ({ ...step, completed: true }))
      default:
        return steps
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
                {stats.totalOrders > 0 && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-accent-400 hover:text-accent-300 transition-colors duration-200"
                  >
                    View All →
                  </button>
                )}
              </div>
              {stats.totalOrders === 0 ? (
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
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400 text-center">
                    You have {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}. 
                    Click "View All" to see your order history.
                  </p>
                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="btn-primary"
                    >
                      View My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Orders</h2>
            
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">No orders found</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-400 font-bold text-lg">₹{order.totalPrice.toFixed(2)}</p>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                          order.status === 'PROCESSING' ? 'bg-blue-600/20 text-blue-400' :
                          order.status === 'SHIPPED' ? 'bg-purple-600/20 text-purple-400' :
                          order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-600/20 text-orange-400' :
                          order.status === 'DELIVERED' ? 'bg-green-600/20 text-green-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-primary-800/50 rounded-lg">
                          <img
                            src={item.product.imageUrls[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{item.product.name}</h4>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Qty: {item.quantity}</span>
                              <span>₹{item.price}</span>
                              {item.sizes && <span>Size: {item.sizes}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="mt-4 pt-4 border-t border-primary-700 flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        {order.status === 'DELIVERED' ? 'Delivered' : 
                         order.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' :
                         order.status === 'SHIPPED' ? 'In Transit' :
                         order.status === 'PROCESSING' ? 'Being Prepared' :
                         'Order Placed'}
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'DELIVERED' && (
                          <button className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm rounded-lg transition-colors duration-200">
                            Reorder
                          </button>
                        )}
                        <button 
                          onClick={() => handleTrackOrder(order)}
                          className="px-4 py-2 border border-primary-600 text-gray-300 hover:text-white hover:border-primary-500 text-sm rounded-lg transition-colors duration-200"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart({
                          id: item.product.id,
                          name: item.product.name,
                          price: item.product.price,
                          imageUrl: item.product.imageUrls[0] || ''
                        }, 1)}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        ADD TO CART
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
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
                <p className="text-gray-400 text-center">
                  You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart.
                </p>
                <div className="text-center">
                  <Link
                    href="/cart"
                    className="btn-primary"
                  >
                    Go to Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-accent-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
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
                <h3 className="text-xl font-semibold text-white mb-2">{user.name}</h3>
                <p className="text-gray-400 mb-6">{user.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-white">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Tracking Modal */}
      {showTrackingModal && selectedOrderForTracking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-900 border border-primary-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-700">
              <div>
                <h3 className="text-xl font-semibold text-white">Order Tracking</h3>
                <p className="text-gray-400 text-sm">Tracking ID #{selectedOrderForTracking.id.slice(-8)}</p>
              </div>
              <button
                onClick={() => {
                  setShowTrackingModal(false)
                  setSelectedOrderForTracking(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Number</p>
                  <p className="text-white font-semibold">{selectedOrderForTracking.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Placed</p>
                  <p className="text-white font-semibold">{new Date(selectedOrderForTracking.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Delivered</p>
                  <p className="text-white font-semibold">
                    {selectedOrderForTracking.status === 'DELIVERED' 
                      ? new Date(selectedOrderForTracking.createdAt).toLocaleDateString()
                      : 'Pending'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">No of Items</p>
                  <p className="text-white font-semibold">{selectedOrderForTracking.items.length} items</p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedOrderForTracking.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                    selectedOrderForTracking.status === 'PROCESSING' ? 'bg-blue-600/20 text-blue-400' :
                    selectedOrderForTracking.status === 'SHIPPED' ? 'bg-purple-600/20 text-purple-400' :
                    selectedOrderForTracking.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-600/20 text-orange-400' :
                    selectedOrderForTracking.status === 'DELIVERED' ? 'bg-green-600/20 text-green-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {selectedOrderForTracking.status}
                  </span>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-6">Order Tracking</h4>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-primary-700">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                      style={{ 
                        width: `${(getTrackingSteps(selectedOrderForTracking.status).filter(s => s.completed).length - 1) * 25}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Tracking Steps */}
                  <div className="flex justify-between relative">
                    {getTrackingSteps(selectedOrderForTracking.status).map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center">
                        {/* Step Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          step.completed 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                            : 'bg-primary-700 text-gray-400'
                        }`}>
                          {step.id === 'placed' && <ShoppingCart className="w-6 h-6" />}
                          {step.id === 'packed' && <Package className="w-6 h-6" />}
                          {step.id === 'transit' && <Truck className="w-6 h-6" />}
                          {step.id === 'delivery' && <ShoppingBag className="w-6 h-6" />}
                          {step.id === 'delivered' && <Home className="w-6 h-6" />}
                        </div>
                        
                        {/* Step Label */}
                        <div className="text-center">
                          <p className={`text-sm font-medium mb-1 ${
                            step.completed ? 'text-white' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {step.completed 
                              ? new Date(selectedOrderForTracking.createdAt).toLocaleDateString()
                              : 'Pending'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-primary-800/50 border border-primary-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrderForTracking.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-primary-900/50 rounded-lg">
                      <img
                        src={item.product.imageUrls[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="text-white font-medium text-sm">{item.product.name}</h5>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          <span>₹{item.price}</span>
                          {item.sizes && <span>Size: {item.sizes}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="mt-4 pt-4 border-t border-primary-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-xl font-bold text-accent-400">₹{selectedOrderForTracking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
