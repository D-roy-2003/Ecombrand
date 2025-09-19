'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useWishlist } from '@/lib/useWishlist'
import { useFlyingHeart } from '@/lib/FlyingHeartContext'
import toast from 'react-hot-toast'

interface FeaturedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrls: string[]
  category: string
}

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addToWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist()
  const { triggerFlyingHeart } = useFlyingHeart()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredProducts.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const handleAddToWishlist = async (product: FeaturedProduct) => {
    if (isInWishlist(product.id)) {
      // Product already in wishlist, do nothing
      return
    }

    const success = await addToWishlist(product.id)
    if (success) {
      
      // Trigger flying heart animation with delay
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        console.log('🚀 Featured Products - Triggering flying heart from:', rect.left, rect.top)
        
        setTimeout(() => {
          triggerFlyingHeart({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          })
          console.log('💖 Featured Products - Flying heart animation started!')
        }, 200) // Slightly longer delay for featured products
      }
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-white">FEATURED</span>{' '}
              <span className="text-gradient">PRODUCTS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Loading featured products...
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-white">FEATURED</span>{' '}
              <span className="text-gradient">PRODUCTS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              No featured products available at the moment
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-primary-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
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
                    src={featuredProducts[currentIndex].imageUrls[0] || '/placeholder.jpg'}
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
                    <div className="mb-6">
                      {featuredProducts[currentIndex].originalPrice && featuredProducts[currentIndex].originalPrice! > featuredProducts[currentIndex].price ? (
                        <>
                          <span className="text-lg text-gray-400 line-through block">
                            ₹{featuredProducts[currentIndex].originalPrice}
                          </span>
                          <span className="text-2xl font-bold text-accent-400">
                            ₹{featuredProducts[currentIndex].price}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-accent-400">
                          ${featuredProducts[currentIndex].price}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 sm:gap-4 justify-center">
                      <Link 
                        href={`/product/${featuredProducts[currentIndex].id}`}
                        className="btn-primary flex items-center justify-center min-w-[120px] sm:min-w-[140px] h-10 sm:h-12 text-xs sm:text-sm px-2 sm:px-4"
                      >
                        VIEW DETAILS
                      </Link>
                      <button
                        ref={buttonRef}
                        className={`btn-secondary flex items-center justify-center gap-1 sm:gap-2 min-w-[120px] sm:min-w-[140px] h-10 sm:h-12 text-xs sm:text-sm px-2 sm:px-4 ${
                          isInWishlist(featuredProducts[currentIndex].id) 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : ''
                        }`}
                        onClick={() => handleAddToWishlist(featuredProducts[currentIndex])}
                        disabled={wishlistLoading || isInWishlist(featuredProducts[currentIndex].id)}
                      >
                        <Heart 
                          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                            isInWishlist(featuredProducts[currentIndex].id) ? 'fill-current' : ''
                          }`} 
                        />
                        <span className="truncate">
                          {isInWishlist(featuredProducts[currentIndex].id) ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
                        </span>
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
          transition={{ duration: 1, delay: 0.2 }}
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
