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
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-400">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
                <ProductGrid products={filteredProducts} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
