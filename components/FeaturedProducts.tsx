'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'

// Mock featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'REBEL HOODIE',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop',
    category: 'HOODIES'
  },
  {
    id: '2',
    name: 'URBAN TEE',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    category: 'TSHIRTS'
  },
  {
    id: '3',
    name: 'STREET PANTS',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop',
    category: 'PANTS'
  },
  {
    id: '4',
    name: 'EDGE SNEAKERS',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    category: 'SHOES'
  }
]

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  return (
    <section className="section-padding bg-primary-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-white">FEATURED</span>{' '}
            <span className="text-gradient">PRODUCTS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our latest drops and most popular pieces
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={featuredProducts[currentIndex].imageUrl}
                    alt={featuredProducts[currentIndex].name}
                    className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                
                {/* Product Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-accent-600 text-white text-sm font-medium mb-3">
                      {featuredProducts[currentIndex].category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {featuredProducts[currentIndex].name}
                    </h3>
                    <p className="text-2xl font-bold text-accent-400 mb-6">
                      ${featuredProducts[currentIndex].price}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link 
                        href={`/product/${featuredProducts[currentIndex].id}`}
                        className="btn-primary"
                      >
                        VIEW DETAILS
                      </Link>
                      <button className="btn-secondary">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-accent-500 scale-125' 
                    : 'bg-gray-400 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/shop" className="btn-primary">
            VIEW ALL PRODUCTS
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
