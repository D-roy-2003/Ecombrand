'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Plus,
  X,
  Package
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getCartItems, getCartTotal, isUserAuthenticated, clearCart, removeFromCart } from '@/lib/cart'
import { CartItem } from '@/lib/cart'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [productDetails, setProductDetails] = useState<{[key: string]: {originalPrice: number, price: number}}>({})
  
  const [activeAddressTab, setActiveAddressTab] = useState('home')
  const [promoCode, setPromoCode] = useState('')
  
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Order Notes
    orderNotes: ''
  })

  const [addresses] = useState([
    {
      id: 'home',
      type: 'Home',
      address: '123, Street Name, City, State - 700001',
      isDefault: true
    },
    {
      id: 'work',
      type: 'Work',
      address: 'Office Bldg, City - 700001',
      isDefault: false
    }
  ])

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!isUserAuthenticated()) {
        router.push('/login')
        return
      }

      try {
        const items = await getCartItems()
        const cartTotal = await getCartTotal()
        
        if (items.length === 0) {
          router.push('/cart')
          return
        }
        
        setCartItems(items)
        setTotal(cartTotal)
        
        // Fetch product details for savings calculation
        await fetchProductDetails(items)
      } catch (error) {
        console.error('Error loading checkout data:', error)
        toast.error('Failed to load checkout data')
        router.push('/cart')
      } finally {
        setLoading(false)
      }
    }

    loadCheckoutData()
  }, [router])

  const fetchProductDetails = async (items: CartItem[]) => {
    try {
      const productIds = Array.from(new Set(items.map(item => item.productId)))
      const response = await fetch('/api/products/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds })
      })

      if (response.ok) {
        const products = await response.json()
        const productMap: {[key: string]: {originalPrice: number, price: number}} = {}
        
        products.forEach((product: any) => {
          productMap[product.id] = {
            originalPrice: product.originalPrice || product.price,
            price: product.price
          }
        })
        
        setProductDetails(productMap)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields')
      return
    }

    setProcessing(true)
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Clear cart after successful order
      await clearCart()
      
      setOrderComplete(true)
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Error processing order:', error)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
                <p className="text-gray-300 mb-6">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <p className="text-sm text-gray-400 mb-8">
                  Order #: ROT-{Date.now().toString().slice(-8)}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/shop')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const shippingCost = total > 50 ? 0 : 9.99
  const tax = total * 0.08
  const finalTotal = total + shippingCost + tax

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and main nav */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded">
                  ROT
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-300 hover:text-white text-sm">Home</a>
                <a href="/shop" className="text-gray-300 hover:text-white text-sm">Shop</a>
                <a href="/contact" className="text-gray-300 hover:text-white text-sm">Contact</a>
              </nav>
            </div>
            
            {/* Right side - Help, Orders, Account */}
            <div className="flex items-center space-x-6">
              <a href="/help" className="text-gray-300 hover:text-white text-sm">Help</a>
              <a href="/user/dashboard#orders" className="text-gray-300 hover:text-white text-sm">Orders</a>
              <a href="/user/dashboard" className="text-gray-300 hover:text-white text-sm">Account</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to cart */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </button>

        {/* Secure checkout heading */}
        <h1 className="text-white text-xl font-semibold mb-8">Secure checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress + Trust Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 rounded bg-gray-700">
                    <div className="h-2 w-2/3 rounded bg-red-600" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Step 2 of 3: Delivery & Payment
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-400 text-xs">SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-400 text-xs">Free shipping $50+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-400 text-xs">7‑day returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-red-500" />
                <h2 className="text-white text-lg font-semibold">Delivery Address</h2>
              </div>

              {/* Address Tabs */}
              <div className="flex gap-1 mb-6">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setActiveAddressTab(addr.id)}
                    className={`px-4 py-2 text-sm rounded transition-colors ${
                      activeAddressTab === addr.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {addr.type}
                  </button>
                ))}
              </div>

              {/* Selected Address */}
              {addresses.map((addr) => (
                activeAddressTab === addr.id && (
                  <div key={addr.id} className="bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{addr.type}</p>
                        <p className="text-gray-300 text-sm mt-1">{addr.address}</p>
                        {addr.isDefault && (
                          <span className="inline-block bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded mt-2">
                            Default here
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}

              <button className="text-red-500 hover:text-red-400 text-sm font-medium">
                Add new address
              </button>
            </div>

            {/* Product Preview Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-red-500" />
                <h2 className="text-white text-lg font-semibold">Review Your Items</h2>
              </div>

              {/* Savings Banner */}
              {cartItems.length > 0 && (
                <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">
                      You are saving ${cartItems.reduce((totalSavings, item) => {
                        const productDetail = productDetails[item.productId]
                        if (productDetail) {
                          const originalPrice = productDetail.originalPrice
                          const currentPrice = productDetail.price
                          const itemSavings = (originalPrice - currentPrice) * item.quantity
                          return totalSavings + itemSavings
                        }
                        return totalSavings
                      }, 0).toFixed(2)} on this order
                    </span>
                  </div>
                </div>
              )}

              {/* Product Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white text-sm font-medium mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-xs mb-2">ROT Brand</p>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={async () => {
                              try {
                                const result = await removeFromCart(item.productId, item.selectedSize)
                                if (result.success) {
                                  // Remove item from local state
                                  const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id)
                                  setCartItems(updatedItems)
                                  
                                  // Recalculate total
                                  const newTotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
                                  setTotal(newTotal)
                                  
                                  toast.success('Item removed from cart')
                                } else {
                                  toast.error(result.message || 'Failed to remove item')
                                }
                              } catch (error) {
                                console.error('Error removing item:', error)
                                toast.error('Failed to remove item')
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Size and Quantity */}
                        <div className="flex items-center gap-4 mb-3">
                          {item.selectedSize && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">Size:</span>
                              <span className="text-white text-xs font-medium">
                                {item.selectedSize}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Qty:</span>
                            <span className="text-white text-xs font-medium">
                              {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-green-400 text-xs">
                            Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offer Applied Banner */}
              {cartItems.length > 1 && (
                <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm">
                      Buy 2 for $99 offer applied!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes and Promo Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Notes */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-white text-sm font-medium mb-3">Order notes (optional)</h3>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any instructions for the delivery person..."
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              {/* Promo Code */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-white text-sm font-medium mb-3">Have a promo code?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors">
                    Apply
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300 text-xs">Secure payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300 text-xs">Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSubmit}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Proceed to review'}
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-semibold">Order Summary</h2>
                <span className="text-gray-400 text-sm">{cartItems.length} items</span>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs">Qty: {item.quantity}</span>
                        <button 
                          className="text-gray-400 hover:text-white text-xs"
                          onClick={async () => {
                            try {
                              const result = await removeFromCart(item.productId, item.selectedSize)
                              if (result.success) {
                                // Remove item from local state
                                const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id)
                                setCartItems(updatedItems)
                                
                                // Recalculate total
                                const newTotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
                                setTotal(newTotal)
                                
                                toast.success('Item removed from cart')
                              } else {
                                toast.error(result.message || 'Failed to remove item')
                              }
                            } catch (error) {
                              console.error('Error removing item:', error)
                              toast.error('Failed to remove item')
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Subtotal</span>
                  <span className="text-white text-sm">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Shipping</span>
                  <span className="text-white text-sm">
                    {shippingCost === 0 ? '$0.00' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Tax</span>
                  <span className="text-white text-sm">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-white">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - $${finalTotal.toFixed(2)}`
                )}
              </button>

              {/* Security Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300 text-xs">Secure SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300 text-xs">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300 text-xs">7 day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
