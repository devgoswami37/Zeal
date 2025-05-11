"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
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

const initialState: CartState = {
  items: [],
  subtotal: 0,
  note: "",
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Update the CartProvider to use localStorage for persistence

// Replace the current CartProvider function with this updated version
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => {
    // Try to load cart from localStorage on initial render (client-side only)
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Check if the saved cart has expired
          const expiryDate = parsedCart.expiryDate
          if (expiryDate && new Date(expiryDate) > new Date()) {
            // Cart is still valid
            return parsedCart.data
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    return initialState
  })

  // Calculate subtotal whenever items change
  useEffect(() => {
    const newSubtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    setCart((prev) => ({ ...prev, subtotal: newSubtotal }))
  }, [cart.items])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Set expiry date to 30 days from now
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)

      localStorage.setItem(
        "cart",
        JSON.stringify({
          data: cart,
          expiryDate: expiryDate.toISOString(),
        }),
      )
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  const addToCart = (newItem: CartItem) => {
    console.log("Adding to cart:", newItem)
    setCart((prev) => {
      const existingItemIndex = prev.items.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prev.items]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return { ...prev, items: updatedItems }
      }

      // Add new item if it doesn't exist
      return { ...prev, items: [...prev.items, newItem] }
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    }))
  }

  const updateNote = (note: string) => {
    setCart((prev) => ({ ...prev, note }))
  }

  const clearCart = () => {
    setCart(initialState)
    // Also clear from localStorage
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateNote, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// export type { CartItem }
