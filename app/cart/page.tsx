"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { readCart, updateQuantity, removeFromCart, clearCart, cartTotal, CartItem } from '@/lib/cart'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState<number>(0)

  const refresh = () => {
    const current = readCart()
    setItems(current)
    setTotal(cartTotal())
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleQty = (id: string, qty: number) => {
    updateQuantity(id, qty)
    refresh()
  }

  const handleRemove = (id: string) => {
    removeFromCart(id)
    refresh()
  }

  const handleClear = () => {
    clearCart()
    refresh()
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Header */}
      <section className="relative pt-28 md:pt-32 pb-10 border-b border-primary-800 bg-gradient-to-b from-black via-primary-900/40 to-black">
        <div className="container-custom px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-2 text-white">Your Cart</h1>
          <p className="text-gray-300">Review your items and proceed to checkout</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-300 mb-6">Your cart is empty.</p>
              <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card flex items-center gap-4"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-accent-400 font-bold">${(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 border border-primary-700 text-white"
                        onClick={() => handleQty(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-white">{item.quantity}</span>
                      <button
                        className="px-3 py-1 border border-primary-700 text-white"
                        onClick={() => handleQty(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="card h-fit">
                <h3 className="text-white text-xl font-semibold mb-4">Order Summary</h3>
                <div className="flex items-center justify-between text-gray-300 mb-2">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <button className="btn-primary w-full mb-3">Checkout</button>
                <button className="btn-secondary w-full" onClick={handleClear}>Clear Cart</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}


