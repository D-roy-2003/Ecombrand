'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  imageUrl: string
  stock: number
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className="bg-primary-900 border border-primary-800 rounded-lg overflow-hidden hover:border-accent-500 transition-all duration-300">
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-accent-600 text-white text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Stock Status */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded-full">
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

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors duration-300">
                  <Link href={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  {product.category} • {product.stock} in stock
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent-400">
                    ${product.price}
                  </span>
                  <button 
                    className="btn-primary text-sm py-2 px-4"
                    disabled={product.stock === 0}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
