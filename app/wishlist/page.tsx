'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Trash2, ArrowLeft, Eye, X, Heart } from 'lucide-react'
import { useWishlist } from '@/lib/useWishlist'
import { addToCart, isUserAuthenticated } from '@/lib/cart'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist()
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [addingToCart, setAddingToCart] = useState(false)

  const handleRemoveFromWishlist = async (productId: string) => {
    setIsRemoving(productId)
    await removeFromWishlist(productId)
    setIsRemoving(null)
  }

  const handleAddToCartClick = (product: any) => {
    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product)
      setSelectedSize('')
      setShowSizeModal(true)
    } else {
      // No sizes, add directly to cart
      handleAddToCart(product, '')
    }
  }

  const handleAddToCart = async (product: any, size: string = '') => {
    setAddingToCart(true)
    try {
      const result = await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls[0]
      }, 1, size)

      if (result.success) {
        toast.success('Added to cart!')
        setShowSizeModal(false)
        setSelectedProduct(null)
        setSelectedSize('')
      } else if (result.requiresLogin) {
        toast.error('Please login to add products to the cart')
      } else {
        toast.error(result.message || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleSizeSelection = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    handleAddToCart(selectedProduct, selectedSize)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#120c18]">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#120c18]">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start space-x-4">
                <Link
                  href="/shop"
                  className="p-3 text-gray-400 hover:text-fuchsia-400 transition-all duration-200 hover:bg-[#1a1224] rounded-xl border border-transparent hover:border-fuchsia-500/30 group"
                >
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white flex items-center space-x-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 rounded-2xl">
                      <Heart className="w-10 h-10 text-fuchsia-400 fill-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                    </div>
                    <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">My Wishlist</span>
                  </h1>
                  <p className="text-gray-400 text-lg ml-1">
                    <span className="text-fuchsia-400 font-bold">{wishlist.length}</span> {wishlist.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>
              {wishlist.length > 0 && (
                <Link
                  href="/shop"
                  className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 text-center"
                >
                  Continue Shopping
                </Link>
              )}
            </div>
          </motion.div>

          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-gradient-to-br from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent"></div>
              <div className="relative">
                <div className="p-6 bg-fuchsia-500/10 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-fuchsia-400/50" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h3>
                <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">Start adding products you love to your wishlist and never lose track of them!</p>
                <Link
                  href="/shop"
                  className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 inline-flex items-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Shopping</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group h-full"
                >
                  <div className="bg-gradient-to-br from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-xl overflow-hidden hover:border-fuchsia-500 hover:shadow-xl hover:shadow-fuchsia-500/20 transition-all duration-300 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative overflow-hidden aspect-square flex-shrink-0">
                      <Link href={`/product/${item.product.id}`}>
                        <img
                          src={item.product.imageUrls[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>

                      {/* Remove from Wishlist */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.product.id)}
                          disabled={isRemoving === item.product.id}
                          className="w-10 h-10 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg hover:shadow-red-500/50"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-600/90 to-violet-600/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg">
                          {item.product.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Product Status */}
                      {!item.product.isActive && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg">
                            UNAVAILABLE
                          </span>
                        </div>
                      )}

                      {item.product.stock === 0 && item.product.isActive && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {item.product.discount && item.product.discount > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg">
                            -{item.product.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="mb-3 flex-grow">
                        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors duration-300 line-clamp-2 leading-tight min-h-[2.5rem]">
                          <Link href={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>

                        <p className="text-gray-400 text-xs mb-3">
                          {item.product.stock} in stock
                        </p>

                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xl font-bold text-fuchsia-400">
                            ₹{item.product.price}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Added {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto pt-3 border-t border-[#2a1f3b]">
                        <button
                          className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white text-xs py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!item.product.isActive || item.product.stock === 0}
                          onClick={() => handleAddToCartClick(item.product)}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span className="truncate">
                            {!item.product.isActive ? 'Unavailable' :
                             item.product.stock === 0 ? 'Out of Stock' :
                             'Add to Cart'}
                          </span>
                        </button>

                        <Link
                          href={`/product/${item.product.id}`}
                          className="bg-[#221733] hover:bg-[#2a1f3b] border border-[#2a1f3b] hover:border-fuchsia-500 text-fuchsia-400 text-xs py-2.5 px-3 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      <AnimatePresence>
        {showSizeModal && selectedProduct && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSizeModal(false)
                setSelectedProduct(null)
                setSelectedSize('')
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Select Your Size</h3>
                <button
                  onClick={() => {
                    setShowSizeModal(false)
                    setSelectedProduct(null)
                    setSelectedSize('')
                  }}
                  className="text-gray-400 hover:text-white hover:bg-[#2a1f3b] p-2 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-[#221733] rounded-xl border border-[#2a1f3b]">
                <img
                  src={selectedProduct.imageUrls[0] || '/placeholder.jpg'}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div>
                  <h4 className="text-white font-semibold text-lg line-clamp-1 mb-1">{selectedProduct.name}</h4>
                  <p className="text-fuchsia-400 font-bold text-xl">₹{selectedProduct.price}</p>
                </div>
              </div>

              {/* Size Options */}
              <div className="mb-8">
                <p className="text-white mb-4 font-semibold text-lg">Available Sizes:</p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border-2 rounded-xl text-base font-bold transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-400 scale-105 shadow-lg shadow-fuchsia-500/50'
                          : 'border-[#2a1f3b] text-gray-300 hover:border-fuchsia-500/50 hover:text-white hover:bg-[#221733]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSizeModal(false)
                    setSelectedProduct(null)
                    setSelectedSize('')
                  }}
                  className="flex-1 py-3.5 px-4 border-2 border-[#2a1f3b] text-white rounded-xl hover:border-fuchsia-500/50 hover:bg-[#221733] transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSizeSelection}
                  disabled={!selectedSize || addingToCart}
                  className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white py-3.5 px-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
