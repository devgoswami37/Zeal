"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart-context"
import Header from "@/app/components/header"
import { extendCartExpiry } from "@/lib/cart-utils"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, updateNote } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    extendCartExpiry(30) // Extend for 30 days
  }, [])

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
      setIsUpdating(true)
    }
  }

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId)
    setIsUpdating(true)
  }

  if (!isClient) {
    // 🔥 Do not render anything cart-dependent during SSR
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8 pt-20">
        <h1 className="text-2xl font-medium mb-8 text-center">Shopping cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Your cart is currently empty</p>
            <Link href="/products" className="text-[#b79987] border-b-[1px] border-[#b79987] pb-1">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-8">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <div className="relative w-24 h-32 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="font-medium">₹{item.product.price.toFixed(2)}</p>
                    </div>
                    <p className="text-gray-500 mb-4">
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex border rounded">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 border-r"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 text-center"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 border-l"
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-gray-500 underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div className="flex gap-4 mb-8">
              <Button variant="outline" onClick={() => setIsUpdating(false)} disabled={!isUpdating}>
                Update cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue shopping</Link>
              </Button>
            </div>

            {/* Order Note */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Add a note to your order</h3>
              <Textarea
                value={cart.note}
                onChange={(e) => updateNote(e.target.value)}
                placeholder="Special instructions for your order"
                className="w-full"
              />
            </div>

            {/* Subtotal and Checkout */}
            <div className="border-t pt-6">
              <div className="flex justify-between mb-4">
                <span className="text-xl">Subtotal</span>
                <span className="text-xl">₹{cart.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-gray-500 mb-6">Tax included and shipping calculated at checkout</p>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Check out</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
