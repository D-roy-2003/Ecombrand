'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Link from 'next/link'
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWishlist } from '@/lib/useWishlist'

interface FeaturedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  imageUrls: string[]
  category: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0)
  const { toggleWishlist, isInWishlist } = useWishlist()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?featured=true&limit=12', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setProducts((data.products || []).filter((p: FeaturedProduct) => Array.isArray(p.imageUrls) && p.imageUrls.length > 0))
      } catch (e) {
        console.error('Failed to load featured products', e)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleWishlist = async (productId: string, ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    await toggleWishlist(productId)
  }

  const goToPrevious = () => {
    if (products.length <= 4) return
    setCurrentIndex(prev => (prev === 0 ? Math.max(0, products.length - 4) : prev - 1))
  }

  const goToNext = () => {
    if (products.length <= 4) return
    setCurrentIndex(prev => (prev >= products.length - 4 ? 0 : prev + 1))
  }

  // Mobile navigation functions
  const goToPreviousMobile = () => {
    setMobileCurrentIndex(prev => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const goToNextMobile = () => {
    setMobileCurrentIndex(prev => (prev >= products.length - 1 ? 0 : prev + 1))
  }

  // Handle drag end for mobile swipe
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      goToPreviousMobile()
    } else if (info.offset.x < -threshold) {
      goToNextMobile()
    }
  }

  // Get current set of 4 products to display
  const currentProducts = products.length > 4
    ? products.slice(currentIndex, currentIndex + 4)
    : products

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#120c18] via-[#1b1327]/40 to-[#120c18]" />
      <div className="relative container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-2">Featured Products</h2>
          <p className="text-gray-400 text-base md:text-lg">Handpicked rebellion for the brave</p>
        </motion.div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading featured…</div>
        ) : products.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">No featured products yet</div>
        ) : (
          <>
            {/* Mobile Carousel (sm and below) */}
            <div className="block sm:hidden relative">
              {/* Mobile Navigation Buttons */}
              {products.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousMobile}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextMobile}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next product"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Mobile Product Counter */}
              {products.length > 1 && (
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm">
                    {mobileCurrentIndex + 1} of {products.length}
                  </p>
                </div>
              )}

              {/* Mobile Swipeable Container */}
              <div className="overflow-hidden" ref={constraintsRef}>
                <motion.div
                  className="flex"
                  drag="x"
                  dragConstraints={constraintsRef}
                  onDragEnd={handleDragEnd}
                  animate={{ x: -mobileCurrentIndex * 100 + '%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {products.map((p, index) => (
                    <motion.div
                      key={p.id}
                      className="w-full flex-shrink-0 px-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/product/${p.id}`} className="group block">
                        <div className="relative overflow-hidden rounded-xl bg-[#1a1224] border border-[#2a1f3b] hover:border-white/30 transition-all">
                          <div className="relative h-80">
                            <img src={p.imageUrls[0] || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-semibold text-lg mb-1">{p.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{p.category}</p>
                            <div className="flex items-center justify-between">
                              {p.originalPrice && p.originalPrice > p.price ? (
                                <div>
                                  <span className="text-sm text-gray-400 line-through mr-2">₹{p.originalPrice}</span>
                                  <span className="text-fuchsia-400 font-semibold text-lg">₹{p.price}</span>
                                </div>
                              ) : (
                                <span className="text-fuchsia-400 font-semibold text-lg">₹{p.price}</span>
                              )}
                              <button
                                className={`px-3 h-9 text-sm rounded border ${isInWishlist(p.id) ? 'border-fuchsia-600 text-fuchsia-400' : 'border-white/20 text-white/80 hover:border-white/40'}`}
                                onClick={(ev) => handleWishlist(p.id, ev)}
                              >
                                <span className="inline-flex items-center gap-2">
                                  <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-current' : ''}`} />
                                  {isInWishlist(p.id) ? 'Remove' : 'Wishlist'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Mobile Dot Indicators */}
              {products.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setMobileCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === mobileCurrentIndex
                          ? 'bg-fuchsia-400 w-6'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to product ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Grid (sm and above) */}
            <div className="hidden sm:block relative">
              {/* Desktop Navigation Buttons */}
              {products.length > 4 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    aria-label="Previous products"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    aria-label="Next products"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Desktop Product Counter */}
              {products.length > 4 && (
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm">
                    Showing {currentIndex + 1}-{Math.min(currentIndex + 4, products.length)} of {products.length} products
                  </p>
                </div>
              )}

              {/* Desktop Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.05, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/product/${p.id}`} className="group block">
                      <div className="relative overflow-hidden rounded-xl bg-[#1a1224] border border-[#2a1f3b] hover:border-white/30 transition-all">
                        <div className="relative h-64">
                          <img src={p.imageUrls[0] || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold line-clamp-1">{p.name}</h3>
                          <p className="text-sm text-gray-400 mb-3">{p.category}</p>
                          <div className="flex items-center justify-between">
                            {p.originalPrice && p.originalPrice > p.price ? (
                              <div>
                                <span className="text-sm text-gray-400 line-through mr-2">₹{p.originalPrice}</span>
                                <span className="text-fuchsia-400 font-semibold">₹{p.price}</span>
                              </div>
                            ) : (
                              <span className="text-fuchsia-400 font-semibold">₹{p.price}</span>
                            )}
                            <button
                              className={`px-3 h-9 text-sm rounded border ${isInWishlist(p.id) ? 'border-fuchsia-600 text-fuchsia-400' : 'border-white/20 text-white/80 hover:border-white/40'}`}
                              onClick={(ev) => handleWishlist(p.id, ev)}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-current' : ''}`} />
                                {isInWishlist(p.id) ? 'Remove' : 'Wishlist'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/shop" className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-semibold">
            Explore the full collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}