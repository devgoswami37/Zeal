import type { Product } from "@/app/lib/types"

export interface CartItem {
  id: number
  product: Product
  quantity: number
  selectedColor: string
  selectedSize: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  note: string
}

export interface CartContextType {
  cart: CartState
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  updateNote: (note: string) => void
  clearCart: () => void
}
