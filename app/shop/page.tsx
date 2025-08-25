'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'
import Footer from '@/components/Footer'

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'REBEL HOODIE',
    price: 89.99,
    category: 'HOODIES',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    stock: 25
  },
  {
    id: '2',
    name: 'URBAN TEE',
    price: 49.99,
    category: 'TSHIRTS',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    stock: 50
  },
  {
    id: '3',
    name: 'STREET PANTS',
    price: 129.99,
    category: 'PANTS',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
    stock: 15
  },
  {
    id: '4',
    name: 'EDGE SNEAKERS',
    price: 199.99,
    category: 'SHOES',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    stock: 30
  },
  {
    id: '5',
    name: 'SKULL TEE',
    price: 59.99,
    category: 'TSHIRTS',
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop',
    stock: 40
  },
  {
    id: '6',
    name: 'DARK HOODIE',
    price: 99.99,
    category: 'HOODIES',
    imageUrl: 'https://images.unsplash.com/photo-1576566587128-9bbe0d6c2c0c?w=400&h=500&fit=crop',
    stock: 20
  },
  {
    id: '7',
    name: 'CHAIN NECKLACE',
    price: 79.99,
    category: 'ACCESSORIES',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop',
    stock: 35
  },
  {
    id: '8',
    name: 'LEATHER JACKET',
    price: 299.99,
    category: 'HOODIES',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    stock: 10
  }
]

export default function ShopPage() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [filters, setFilters] = useState({
    category: 'ALL',
    priceRange: [0, 500],
    search: ''
  })

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
        product.category.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-padding"
        >
          <div className="container-custom">
            <div className="text-center mb-16">
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
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-300">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                  <select className="input-field text-sm">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>

                <ProductGrid products={filteredProducts} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
