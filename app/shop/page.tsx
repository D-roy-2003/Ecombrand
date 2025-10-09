'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'

// Define the Product type
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrls: string[]
  stock: number
  isActive: boolean
}

// Define the Filters type
interface Filters {
  category: string
  priceRange: [number, number]
  search: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    category: 'ALL',
    priceRange: [0, 10000],
    search: ''
  })

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
          setFilteredProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on current filters
  useEffect(() => {
    let filtered = products

    // Category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, filters])

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120c18]">
        <Navigation />
        <div className="pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-padding"
          >
            <div className="container-custom">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                  <span className="text-white">SHOP</span>{' '}
                  <span className="text-gradient">COLLECTION</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Discover our latest streetwear collection designed for the urban rebel
                </p>
              </div>
              
              {/* Loading State */}
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner 
                  text="Loading products..." 
                  size="lg"
                  className="text-center"
                />
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#120c18]">
      <Navigation />
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-padding"
        >
          <div className="container-custom">
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-2">
                  <span className="text-white">SHOP</span>{' '}
                  <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">COLLECTION</span>
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed"
              >
                Discover our latest streetwear collection designed for the <span className="text-fuchsia-400 font-semibold">urban rebel</span>
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Filters Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-20">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </motion.div>

              {/* Products Grid */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="lg:col-span-3"
              >
                {/* Products Grid or Empty State */}
                {filteredProducts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 bg-gradient-to-br from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-2xl shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent"></div>
                    <div className="relative">
                      <div className="text-7xl mb-6">🔍</div>
                      <h3 className="text-3xl font-bold text-white mb-4">No products found</h3>
                      <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">Try adjusting your filters to see more results</p>
                      <button
                        onClick={() => setFilters({ category: 'ALL', priceRange: [0, 10000], search: '' })}
                        className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <ProductGrid products={filteredProducts} />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
