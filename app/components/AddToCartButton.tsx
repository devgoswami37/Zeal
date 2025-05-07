"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import type { Product } from "@/app/lib/types"

interface AddToCartButtonProps {
  product: Product
  selectedColor: string
  selectedSize: string
  className?: string
}

export default function AddToCartButton({
  product,
  selectedColor,
  selectedSize,
  className = "",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    setIsAdding(true)

    // Add to cart with a slight delay to show loading state
    setTimeout(() => {
      addToCart({
        id: Date.now(), // Unique ID for cart item
        product,
        quantity,
        selectedColor,
        selectedSize,
      })

      setIsAdding(false)
      setShowSuccess(true)

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    }, 500)
  }

  const handleBuyItNow = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    // Add the product to the cart
    addToCart({
      id: Date.now(), // Unique ID for cart item
      product,
      quantity,
      selectedColor,
      selectedSize,
    })

    // Redirect to the checkout page
    router.push("/checkout")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 border-r"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-16 text-center"
            aria-label="Quantity"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 border-l"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!product.inStock || isAdding}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400 relative"
      >
        {isAdding ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Added to Cart!
          </span>
        ) : product.inStock ? (
          `Add to Cart - $${(product.price * quantity).toFixed(2)}`
        ) : (
          "Out of Stock"
        )}
      </button>

      <button
        onClick={handleBuyItNow}
        disabled={!product.inStock}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        Buy it now
      </button>
    </div>
  )
}