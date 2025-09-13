export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  addedAt: number // timestamp
}

const CART_KEY = 'rk_cart_v2'
const CART_EXPIRY_HOURS = 2

function isItemExpired(addedAt: number): boolean {
  const now = Date.now()
  const expiryTime = CART_EXPIRY_HOURS * 60 * 60 * 1000 // 2 hours in milliseconds
  return (now - addedAt) > expiryTime
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
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
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export async function addToCart(item: Omit<CartItem, 'quantity' | 'addedAt'>, quantity: number = 1): Promise<{ success: boolean; message?: string; availableStock?: number }> {
  try {
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
  const items = readCart().map((i) => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
  writeCart(items)
}

export function removeFromCart(id: string) {
  const items = readCart().filter((i) => i.id !== id)
  writeCart(items)
}

export function clearCart() {
  writeCart([])
}

export function cartCount(): number {
  return readCart().reduce((sum, i) => sum + i.quantity, 0)
}

export function cartTotal(): number {
  return readCart().reduce((sum, i) => sum + i.price * i.quantity, 0)
}


