export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  addedAt: number // timestamp
}

const CART_KEY_PREFIX = 'rk_cart_v3_'
const CART_EXPIRY_HOURS = 2

function isItemExpired(addedAt: number): boolean {
  const now = Date.now()
  const expiryTime = CART_EXPIRY_HOURS * 60 * 60 * 1000 // 2 hours in milliseconds
  return (now - addedAt) > expiryTime
}

// Get current user ID from localStorage or return null if not logged in
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem('current_user_id')
  } catch {
    return null
  }
}

// Set current user ID in localStorage
export function setCurrentUserId(userId: string | null) {
  if (typeof window === 'undefined') return
  try {
    if (userId) {
      window.localStorage.setItem('current_user_id', userId)
    } else {
      window.localStorage.removeItem('current_user_id')
    }
  } catch (error) {
    console.error('Error setting user ID:', error)
  }
}

// Get cart key for current user
function getCartKey(): string {
  const userId = getCurrentUserId()
  return userId ? `${CART_KEY_PREFIX}${userId}` : `${CART_KEY_PREFIX}guest`
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const cartKey = getCartKey()
    const raw = window.localStorage.getItem(cartKey)
    if (!raw) return []
    
    const items = JSON.parse(raw) as CartItem[]
    // Filter out expired items
    const validItems = items.filter(item => !isItemExpired(item.addedAt))
    
    // If some items were expired, update localStorage
    if (validItems.length !== items.length) {
      writeCart(validItems)
    }
    
    return validItems
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    const cartKey = getCartKey()
    window.localStorage.setItem(cartKey, JSON.stringify(items))
  } catch (error) {
    console.error('Error writing cart:', error)
  }
}

// Check if user is authenticated
export function isUserAuthenticated(): boolean {
  return getCurrentUserId() !== null
}

export async function addToCart(item: Omit<CartItem, 'quantity' | 'addedAt'>, quantity: number = 1): Promise<{ success: boolean; message?: string; availableStock?: number; requiresLogin?: boolean }> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      return { 
        success: false, 
        message: 'Please login to add products to the cart',
        requiresLogin: true
      }
    }

    // Check current stock availability
    const stockCheck = await fetch(`/api/products/stock/${item.id}`)
    if (!stockCheck.ok) {
      return { success: false, message: 'Unable to verify stock availability' }
    }
    
    const { availableStock } = await stockCheck.json()
    const items = readCart()
    const existingItem = items.find((i) => i.id === item.id)
    const currentCartQuantity = existingItem?.quantity || 0
    const totalRequestedQuantity = currentCartQuantity + quantity
    
    if (totalRequestedQuantity > availableStock) {
      return { 
        success: false, 
        message: `Only ${availableStock} items available in stock. You already have ${currentCartQuantity} in your cart.`,
        availableStock 
      }
    }
    
    const now = Date.now()
    const idx = items.findIndex((i) => i.id === item.id)
    
    if (idx >= 0) {
      items[idx].quantity += quantity
      items[idx].addedAt = now
    } else {
      items.push({ ...item, quantity, addedAt: now })
    }
    
    writeCart(items)
    return { success: true }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, message: 'Failed to add item to cart' }
  }
}

export function updateQuantity(id: string, quantity: number) {
  if (!isUserAuthenticated()) return
  const items = readCart().map((i) => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
  writeCart(items)
}

export function removeFromCart(id: string) {
  if (!isUserAuthenticated()) return
  const items = readCart().filter((i) => i.id !== id)
  writeCart(items)
}

export function clearCart() {
  if (!isUserAuthenticated()) return
  writeCart([])
}

export function cartCount(): number {
  if (!isUserAuthenticated()) return 0
  return readCart().reduce((sum, i) => sum + i.quantity, 0)
}

export function cartTotal(): number {
  if (!isUserAuthenticated()) return 0
  return readCart().reduce((sum, i) => sum + i.price * i.quantity, 0)
}

// Clear cart for specific user (used on logout)
export function clearUserCart(userId: string) {
  if (typeof window === 'undefined') return
  try {
    const cartKey = `${CART_KEY_PREFIX}${userId}`
    window.localStorage.removeItem(cartKey)
  } catch (error) {
    console.error('Error clearing user cart:', error)
  }
}

// Clear all guest carts (cleanup)
export function clearGuestCarts() {
  if (typeof window === 'undefined') return
  try {
    const guestCartKey = `${CART_KEY_PREFIX}guest`
    window.localStorage.removeItem(guestCartKey)
  } catch (error) {
    console.error('Error clearing guest carts:', error)
  }
}

// Clear all cart data (used on logout)
export function clearAllCartData() {
  if (typeof window === 'undefined') return
  try {
    // Clear current user ID
    window.localStorage.removeItem('current_user_id')
    
    // Clear all cart data for all users
    const keys = Object.keys(window.localStorage)
    keys.forEach(key => {
      if (key.startsWith(CART_KEY_PREFIX)) {
        window.localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing all cart data:', error)
  }
}


