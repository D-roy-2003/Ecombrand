'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'
import Footer from '@/components/Footer'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: 'ALL',
    priceRange: [0, 500],
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

  useEffect(() => {
    let filtered = [...products]

    // Category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Price filter
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">
                Shop ({filteredProducts.length} products)
              </h1>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-lg text-white">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
