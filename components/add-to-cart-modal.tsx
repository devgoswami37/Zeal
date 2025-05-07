"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/cart"
import { useRouter } from "next/navigation"

interface AddToCartModalProps {
  item: CartItem
  onClose: () => void
}

export function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white w-full max-w-md mx-4 rounded-lg overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-xl">Added to cart</span>
            </div>
            <button onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="relative w-24 h-32 flex-shrink-0">
              <Image
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">{item.product.name}</h3>
              <p className="text-gray-500 mb-1">Color: {item.selectedColor}</p>
              <p className="text-gray-500 mb-2">Size: {item.selectedSize}</p>
              <p className="font-medium">${item.product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => router.push("/cart")}>
              View cart
            </Button>
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              Checkout
            </Button>
          </div>

          {/* Store Pickup Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium">Pickup available at Saint Clair Avenue West</p>
                <p className="text-gray-600 text-sm">Usually ready in 24 hours</p>
                <button className="text-gray-600 text-sm underline mt-1">View store information</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
