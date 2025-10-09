'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
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
  const trackRef = useRef<HTMLDivElement>(null)
  const { toggleWishlist, isInWishlist } = useWishlist()

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

  const marqueeItems = useMemo(() => {
    if (products.length === 0) return []
    // duplicate for seamless loop
    return [...products, ...products]
  }, [products])

  const handleWishlist = async (productId: string, ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    await toggleWishlist(productId)
  }

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
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p) => (
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
        )}

        <div className="text-center mt-10">
          <Link href="/shop" className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-semibold">
            Explore the full collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}