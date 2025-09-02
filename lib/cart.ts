export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

const CART_KEY = 'rk_cart_v1'

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) as CartItem[] : []
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
  const items = readCart()
  const idx = items.findIndex((i) => i.id === item.id)
  if (idx >= 0) {
    items[idx].quantity += quantity
  } else {
    items.push({ ...item, quantity })
  }
  writeCart(items)
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


