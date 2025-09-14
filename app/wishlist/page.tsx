'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import { useWishlist } from '@/lib/useWishlist'
import { addToCart, isUserAuthenticated } from '@/lib/cart'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist()
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const handleRemoveFromWishlist = async (productId: string) => {
    setIsRemoving(productId)
    await removeFromWishlist(productId)
    setIsRemoving(null)
  }

  const handleAddToCart = async (product: any) => {
    const result = await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrls[0]
    })
    
    if (result.success) {
      toast.success('Added to cart!')
    } else if (result.requiresLogin) {
      toast.error('Please login to add products to the cart')
    } else {
      toast.error(result.message || 'Failed to add to cart')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your wishlist...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/shop"
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <span>❤️</span>
                <span>My Wishlist</span>
              </h1>
              <p className="text-gray-400 mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8">Start adding products you love to your wishlist!</p>
            <Link 
              href="/shop"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group h-full"
              >
                <div className="bg-primary-900 border border-primary-800 rounded-lg overflow-hidden hover:border-accent-500 transition-all duration-300 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative overflow-hidden flex-shrink-0">
                    <Link href={`/product/${item.product.id}`}>
                      <img
                        src={item.product.imageUrls[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                    
                    {/* Remove from Wishlist */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        disabled={isRemoving === item.product.id}
                        className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Product Status */}
                    {!item.product.isActive && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-600 text-white font-medium rounded">
                          UNAVAILABLE
                        </span>
                      </div>
                    )}

                    {item.product.stock === 0 && item.product.isActive && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-4 py-2 bg-yellow-600 text-white font-medium rounded">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4 flex-grow">
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors duration-300 line-clamp-2 leading-tight">
                        <Link href={`/product/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-accent-400">
                          ${item.product.price}
                        </div>
                        {item.product.discount && item.product.discount > 0 && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            -{item.product.discount}% off
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Added {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.product.stock} in stock
                        </div>
                      </div>
                    </div>

                    <button 
                      className="w-full btn-primary text-xs sm:text-sm py-2 sm:py-3 flex items-center justify-center space-x-1 sm:space-x-2 min-h-[40px] sm:min-h-[48px] mt-auto"
                      disabled={!item.product.isActive || item.product.stock === 0}
                      onClick={() => handleAddToCart(item.product)}
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">
                        {!item.product.isActive ? 'Unavailable' : 
                         item.product.stock === 0 ? 'Out of Stock' : 
                         'Add to Cart'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
