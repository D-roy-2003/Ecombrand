'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  RotateCcw, 
  Shield, 
  Plus, 
  Minus,
  ArrowLeft,
  CheckCircle,
  ShoppingCart,
  Zap,
  Skull,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { addToCart, isUserAuthenticated } from '@/lib/cart'
import { useWishlist } from '@/lib/useWishlist'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  imageUrls: string[]
  sizes: string[]
  stock: number
  isFeatured: boolean
  discount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  
  const { isInWishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          router.push('/shop')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/shop')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  // Reset zoom state each time the modal opens
  useEffect(() => {
    if (imageZoom) {
      setIsZoomed(false)
      setZoomOrigin({ x: 50, y: 50 })
    }
  }, [imageZoom])

  const handleAddToCart = async () => {
    if (!product) return

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('SELECT A SIZE, REBEL')
      return
    }

    setAddingToCart(true)
    try {
      const result = await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls[0]
      }, quantity, selectedSize)
      
      if (result.success) {
        toast.success('ADDED TO YOUR ARSENAL')
      } else if (result.requiresLogin) {
        return
      } else {
        toast.error(result.message || 'FAILED TO ADD')
      }
    } catch (error) {
      toast.error('SOMETHING WENT WRONG')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    await toggleWishlist(product.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('LINK COPIED')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Skull className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-4">404 - NOT FOUND</h1>
          <button 
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-purple-600 text-white font-bold uppercase hover:bg-purple-500 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section with Product */}
      <div className="relative min-h-screen pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-fuchsia-900/20" />
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(168,85,247,.1) 35px, rgba(168,85,247,.1) 70px)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Back Button */}
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-fuchsia-400 transition-colors mb-4 sm:mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-wider text-sm font-bold">Back</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-20">
            {/* Product Images with Enhanced Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Main Image */}
              <div className="relative group">
                <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-xl overflow-hidden border border-white/10">
                  <motion.img
                    layoutId={`product-image-${product.id}`}
                    src={product.imageUrls[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setImageZoom(true)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Navigation Buttons */}
                  {product.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage((prev) => (prev === 0 ? product.imageUrls.length - 1 : prev - 1))
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage((prev) => (prev === product.imageUrls.length - 1 ? 0 : prev + 1))
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setImageZoom(true)}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-black text-sm font-black uppercase rounded">
                    {product.stock} LEFT
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-sm font-black uppercase rounded">
                    SOLD OUT
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {product.imageUrls.map((url, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-500/50' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-black uppercase tracking-wider rounded-full">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="px-3 sm:px-4 py-1 sm:py-2 bg-black border border-yellow-500 text-yellow-500 text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              {/* Product Name with Glitch Effect */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white uppercase leading-tight">
                  <motion.span
                    animate={{
                      textShadow: [
                        '0 0 0 rgba(168,85,247,0)',
                        '2px 2px 0 rgba(168,85,247,0.5)',
                        '0 0 0 rgba(168,85,247,0)',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {product.name}
                  </motion.span>
                </h1>
              </div>

              {/* Price with Discount */}
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1 bg-fuchsia-600 text-white text-sm font-black uppercase rounded"
                    >
                      -{discountPercentage}% OFF
                    </motion.span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">About This Piece</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Size Selection with Enhanced Style */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">Choose Your Fit</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 border-2 rounded-lg text-sm font-black uppercase transition-all ${
                          selectedSize === size
                            ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-400 shadow-lg shadow-fuchsia-500/30'
                            : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector with Dark Theme */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Quantity</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center border-2 border-white/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-white/10 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5 text-white" />
                    </button>
                    <span className="px-6 py-3 text-white font-black text-lg min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-white/10 transition-colors disabled:opacity-30"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm uppercase">
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons with Enhanced Style */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-5 px-8 rounded-lg font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-3"
                    disabled={addingToCart || product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>ADDING...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`p-5 border-2 rounded-lg transition-all ${
                      isInWishlist(product.id)
                        ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-400' 
                        : 'border-white/20 text-gray-400 hover:text-white hover:border-white/40'
                    } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-5 border-2 border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Features with Dark Cards */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                {[
                  { icon: <Truck />, text: 'Free shipping over ₹50' },
                  { icon: <RotateCcw />, text: '30-day returns' },
                  { icon: <Shield />, text: 'Secure payment' },
                  { icon: <Skull />, text: '100% Authentic' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="text-fuchsia-400">
                      {feature.icon}
                    </div>
                    <span className="text-sm text-gray-400">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {imageZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setImageZoom(false)}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={() => setImageZoom(false)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8 }}
              exit={{ scale: 0.8 }}
              src={product.imageUrls[selectedImage]}
              alt={product.name}
              className={`max-w-full max-h-[90vh] object-contain ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              animate={{
                scale: isZoomed ? 2 : 1,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
              }}
              transition={{
                duration: isZoomed ? 0.12 : 0.25,
                ease: "easeOut"
              }}
              onMouseMove={(e) => {
                if (!isZoomed) return
                const rect = (e.currentTarget as HTMLImageElement).getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setZoomOrigin({ x, y })
              }}
              onClick={(e) => {
                e.stopPropagation()
                const rect = (e.currentTarget as HTMLImageElement).getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setZoomOrigin({ x, y })
                setIsZoomed((z) => !z)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}