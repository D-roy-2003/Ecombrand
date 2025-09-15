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
  Mail
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getCartItems, getCartTotal, isUserAuthenticated, clearCart } from '@/lib/cart'
import { CartItem } from '@/lib/cart'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
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
            <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              <div className="bg-primary-900 border border-primary-800 rounded-lg p-12">
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
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-secondary"
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
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Billing Information */}
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-accent-400" />
                    <h2 className="text-xl font-bold text-white">Billing Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-accent-400" />
                    <h2 className="text-xl font-bold text-white">Shipping Address</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-accent-400" />
                    <h2 className="text-xl font-bold text-white">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Order Notes (Optional)</h2>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for your order..."
                    className="w-full bg-primary-700 border border-primary-600 text-white rounded-lg px-4 py-3 focus:border-accent-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-700 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-accent-400 font-semibold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-semibold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-white font-semibold">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tax</span>
                    <span className="text-white font-semibold">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-primary-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-xl font-bold text-accent-400">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Free shipping on $50+</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  form="checkout-form"
                  onClick={handleSubmit}
                  disabled={processing}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
