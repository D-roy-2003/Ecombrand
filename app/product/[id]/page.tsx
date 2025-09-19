'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
  ShoppingCart
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
  
  // Use the proper wishlist hook
  const { isInWishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist()

  // Fetch product details
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

  const handleAddToCart = async () => {
    if (!product) return

    // Check if size is required and selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
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
        toast.success('Added to cart!')
      } else if (result.requiresLogin) {
        // No toast message needed - user will be redirected to login page
        return
      } else {
        toast.error(result.message || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    
    // Use the proper wishlist toggle function which handles authentication
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
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <button 
            onClick={() => router.push('/shop')}
            className="btn-primary"
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
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-primary-900 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrls[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index 
                          ? 'border-accent-500' 
                          : 'border-primary-700 hover:border-primary-600'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category & Stock */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-600 text-white text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded-full">
                    Low Stock
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-accent-400">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="px-2 py-1 bg-red-600 text-white text-sm font-medium rounded">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                          selectedSize === size
                            ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                            : 'border-primary-700 text-gray-300 hover:border-accent-500 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="text-sm text-gray-400">
                      Selected size: <span className="text-accent-400 font-medium">{selectedSize}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-primary-700 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-primary-800 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-primary-800 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    className="btn-primary text-lg py-4 px-8 flex items-center justify-center space-x-2"
                    disabled={addingToCart || product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`p-3 border rounded-lg transition-colors ${
                      isInWishlist(product.id)
                        ? 'border-accent-500 bg-accent-500/10 text-accent-400' 
                        : 'border-primary-700 hover:border-primary-600 text-gray-400 hover:text-white'
                    } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 border border-primary-700 rounded-lg text-gray-400 hover:text-white hover:border-primary-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-6 border-t border-primary-800">
                <h3 className="text-lg font-semibold text-white">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-accent-400" />
                    <span className="text-gray-300">Free shipping on orders over ₹50</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-accent-400" />
                    <span className="text-gray-300">30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent-400" />
                    <span className="text-gray-300">Secure payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-400" />
                    <span className="text-gray-300">Authentic products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 