"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/lib/types"
import { cn } from "@/lib/utils"

interface ShopTheLookMobileModalProps {
  product: Product
  allProducts: Product[]
  onClose: () => void
  onProductChange: (productId: number) => void
}

export function ShopTheLookMobileModal({
  product,
  allProducts,
  onClose,
  onProductChange,
}: ShopTheLookMobileModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "")
  const [selectedSize, setSelectedSize] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">SHOP THE LOOK</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Thumbnails */}
        <div className="flex gap-2 p-4 border-b">
          {allProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => onProductChange(p.id)}
              className={cn(
                "w-16 h-16 relative rounded overflow-hidden border-2",
                p.id === product.id ? "border-black" : "border-transparent",
              )}
            >
              <Image src={p.image || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Product Details */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col md:flex-row mb-4">
            {/* Product Image */}
            <div className="w-full md:w-1/2 relative aspect-square mb-4 md:mb-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Product Name, Price */}
            <div className="w-full md:w-1/2 pl-4">
              <h3 className="font-bold text-xl mb-1">{product.name}</h3>
              <p className="font-medium text-xl mb-2">₹{product.price.toFixed(2)}</p>
              {product.inStock ? (
                <p className="text-amber-600 text-sm">
                  <span className="inline-block w-2 h-2 bg-amber-600 rounded-full mr-1"></span>
                  Hurry! Low inventory
                </p>
              ) : (
                <p className="text-red-600 text-sm">Out of stock</p>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">COLOR</h4>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color.name ? "border-black" : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: index === 0 ? "#d97551" : "white",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">SIZE</h4>
              <button className="text-gray-600 text-sm underline">SIZE GUIDE</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 border ${
                    selectedSize === size ? "border-black bg-black text-white" : "border-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="p-4 border-t">
          <Button className="w-full bg-black hover:bg-black/90 text-white py-6">
            ADD TO CART • ₹{product.price.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}
