'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import WishlistButton from './WishlistButton'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  imageUrls: string[]
  stock: number
  isActive: boolean
  discount?: number
}

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-primary-900 border border-primary-800 rounded-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-primary-800"></div>
            <div className="p-6">
              <div className="h-4 bg-primary-800 rounded mb-2"></div>
              <div className="h-3 bg-primary-800 rounded mb-3"></div>
              <div className="h-6 bg-primary-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -8 }}
          className="group h-full"
        >
          <div className="bg-primary-900 border border-primary-800 rounded-lg overflow-hidden hover:border-accent-500 transition-all duration-300 h-full flex flex-col">
            {/* Product Image */}
            <div className="relative overflow-hidden h-48 sm:h-64 flex-shrink-0">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.imageUrls[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
              
              {/* Wishlist Button */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <WishlistButton productId={product.id} />
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                <span className="px-2 sm:px-3 py-1 bg-accent-600 text-white text-xs font-medium rounded-full">
                  {product.category.toUpperCase()}
                </span>
              </div>

              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 mt-6 sm:mt-8">
                  <span className="px-2 sm:px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                    -{product.discount}% OFF
                  </span>
                </div>
              )}

              {/* Stock Status */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded-full">
                    Low Stock
                  </span>
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-600 text-white font-medium rounded">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {/* Product Info - Fixed height container */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
                  <Link href={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {product.category} • {product.stock} in stock
                </p>
              </div>
              
              {/* Price and Button Section - Always at bottom */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-2xl font-bold text-accent-400">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-green-400">
                        Save ₹{(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-accent-400">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                <Link 
                  href={`/product/${product.id}`}
                  className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white flex items-center justify-center gap-2 text-sm py-2 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 flex-shrink-0"
                >
                  <Eye className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">VIEW</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
