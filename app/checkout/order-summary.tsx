import Image from "next/image"
import type { CartItem } from "@/context/cart-context"
import { useEffect, useState } from "react"

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
  showMobile: boolean
}

export function OrderSummary({ cartItems, subtotal, shippingCost, total, showMobile }: OrderSummaryProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)  // Enable rendering on client side after hydration
  }, [])

  if (!isClient) {
    return null // Or a loading spinner
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${showMobile ? "block" : "hidden"} md:block`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order summary</h2>

        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="relative h-16 w-16 rounded bg-gray-100 mr-4 overflow-hidden">
                {item.product.images && item.product.images.length > 0 ? (
                  <Image
                    src={item.product.images[0] || "/placeholder.svg"} // Use the first image in the array or fallback
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <Image
                    src={item.product.image || "/placeholder.svg"} // Fallback if no images
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                )}
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.product.name}</h3>
                <p className="text-xs text-gray-500">
                  {item.selectedColor && `Color: ${item.selectedColor}`}
                  {item.selectedColor && item.selectedSize && ", "}
                  {item.selectedSize && `Size: ${item.selectedSize}`}
                </p>
              </div>
              <div className="text-sm font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Shipping</span>
            {shippingCost > 0 ? (
              <span className="text-sm font-medium">₹{shippingCost.toFixed(2)}</span>
            ) : (
              <span className="text-sm text-gray-600">Enter shipping address</span>
            )}
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-base font-medium">Total</span>
            <div className="text-right">
              <span className="text-sm text-gray-600 block">INR</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
