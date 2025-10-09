'use client'

import { useState, useRef } from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/useWishlist'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function WishlistButton({ 
  productId, 
  className = '', 
  size = 'md',
  showText = false 
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = async () => {
    if (isLoading) return
    
    const success = await toggleWishlist(productId)
    
    if (success) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const isWishlisted = isInWishlist(productId)

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${className}
        relative flex items-center justify-center
        rounded-full transition-all duration-300
        ${isWishlisted 
          ? 'bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600/30' 
          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
        }
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        group
      `}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`
          ${iconSizes[size]}
          transition-all duration-300
          ${isWishlisted ? 'fill-current' : ''}
          ${isAnimating ? 'scale-125' : ''}
        `}
      />
      
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </span>
      )}
      
      {/* Ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
      )}
    </button>
  )
}
