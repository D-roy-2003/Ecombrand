'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'
import { readCart, writeCart, CartItem, updateQuantity, removeFromCart } from '@/lib/cart'
import { cartService, DatabaseCartItem } from '@/lib/cartService'
import toast from 'react-hot-toast'

interface EnhancedCartProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
}

export default function EnhancedCart({ isOpen, onClose, isAuthenticated = false }: EnhancedCartProps) {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([])
  const [dbCartItems, setDbCartItems] = useState<DatabaseCartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load cart items on mount and when authentication status changes
  useEffect(() => {
    loadCartItems()
  }, [isAuthenticated])

  // Auto-refresh cart items every 30 seconds to check for expired items
  useEffect(() => {
    const interval = setInterval(() => {
      loadCartItems()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const loadCartItems = async () => {
    if (isAuthenticated) {
      try {
        const dbItems = await cartService.getDbCart()
        setDbCartItems(dbItems)
        
        // Sync local cart to database if local cart has items
        const localItems = readCart()
        if (localItems.length > 0) {
          await cartService.syncLocalToDbCart(localItems)
          writeCart([]) // Clear local cart after sync
          // Reload database cart
          const updatedDbItems = await cartService.getDbCart()
          setDbCartItems(updatedDbItems)
        }
      } catch (error) {
        console.error('Error loading database cart:', error)
        toast.error('Failed to load cart items')
      }
    } else {
      const localItems = readCart()
      setLocalCartItems(localItems)
    }
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setLoading(true)
    try {
      if (isAuthenticated) {
        // Update database cart
        const success = await cartService.addToDbCart(productId, newQuantity - getCurrentQuantity(productId))
        if (success) {
          await loadCartItems()
          toast.success('Cart updated')
        } else {
          toast.error('Failed to update cart')
        }
      } else {
        // Update local cart
        updateQuantity(productId, newQuantity)
        setLocalCartItems(readCart())
        toast.success('Cart updated')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update cart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setLoading(true)
    try {
      if (isAuthenticated) {
        const success = await cartService.removeFromDbCart(productId)
        if (success) {
          await loadCartItems()
          toast.success('Item removed from cart')
        } else {
          toast.error('Failed to remove item')
        }
      } else {
        removeFromCart(productId)
        setLocalCartItems(readCart())
        toast.success('Item removed from cart')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentQuantity = (productId: string): number => {
    if (isAuthenticated) {
      const item = dbCartItems.find(item => item.productId === productId)
      return item?.quantity || 0
    } else {
      const item = localCartItems.find(item => item.id === productId)
      return item?.quantity || 0
    }
  }

  const getCartItems = () => {
    if (isAuthenticated) {
      return cartService.dbCartToLocalCart(dbCartItems)
    }
    return localCartItems
  }

  const getTotalPrice = () => {
    const items = getCartItems()
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    const items = getCartItems()
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const cartItems = getCartItems()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="ml-auto w-full max-w-md bg-primary-900 border-l border-primary-800 flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-800">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-accent-400" />
                <h2 className="text-xl font-semibold text-white">
                  Shopping Cart ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-primary-800 border border-primary-700 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{item.name}</h4>
                          <p className="text-accent-400 font-semibold">${item.price}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3 mt-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={loading || item.quantity <= 1}
                              className="p-1 rounded-full bg-primary-700 text-gray-300 hover:text-white hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={loading}
                              className="p-1 rounded-full bg-primary-700 text-gray-300 hover:text-white hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 pt-3 border-t border-primary-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="text-white font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-primary-800 p-6">
                <div className="space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-accent-400 font-bold">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full btn-primary">
                    Proceed to Checkout
                  </button>

                  {/* Cart Expiry Notice */}
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 text-center">
                      Items in cart will expire after 2 hours
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
