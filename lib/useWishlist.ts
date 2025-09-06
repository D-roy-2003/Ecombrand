import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    discount?: number
    imageUrls: string[]
    isActive: boolean
    stock: number
  }
  createdAt: string
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/wishlist', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      } else {
        console.error('Failed to fetch wishlist:', response.status)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
        credentials: 'include'
      })

      if (response.ok) {
        const newItem = await response.json()
        setWishlist(prev => [newItem, ...prev])
        toast.success('Added to wishlist!')
        return true
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add to wishlist')
        return false
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.product.id !== productId))
        toast.success('Removed from wishlist!')
        return true
      } else {
        toast.error('Failed to remove from wishlist')
        return false
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId)
  }

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist
  }
}
