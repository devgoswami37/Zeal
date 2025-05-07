"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/app/lib/types"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ShopTheLookModalProps {
  products: Product[]
  initialProductId: number
  isOpen: boolean
  onClose: () => void
}

export function ShopTheLookModal({ products, initialProductId, isOpen, onClose }: ShopTheLookModalProps) {
  const router = useRouter()

  // Ensure we find the correct initial product or default to the first product
  const initialProduct = products.find((p) => p.id === initialProductId) || products[0]

  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct)
  const [selectedColor, setSelectedColor] = useState(initialProduct.colors[0]?.name || "")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedItem, setAddedItem] = useState<{
    id: number
    product: Product
    quantity: number
    selectedColor: string
    selectedSize: string
  } | null>(null)

  // Reset selected color and size when product changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(selectedProduct.colors[0]?.name || "")
      setSelectedSize("")
      setCurrentImageIndex(0)
    }
  }, [selectedProduct])

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Get all product images
  const allImages = selectedProduct
    ? ([selectedProduct.image, selectedProduct.hoverImage, ...(selectedProduct.additionalImages || [])].filter(
        Boolean,
      ) as string[])
    : []

  // Touch handlers for image swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(distance) < minSwipeDistance) return

    if (distance > 0) {
      // Swiped left
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    } else {
      // Swiped right
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    const cartItem = {
      id: selectedProduct.id,
      product: selectedProduct,
      quantity,
      selectedColor,
      selectedSize,
    }

    addToCart(cartItem)
    setAddedItem(cartItem)
    setShowSuccessModal(true)
  }

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  // Handle size guide click
  const handleSizeGuideClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Size guide clicked")
  }

  // Navigate to cart page
  const goToCart = () => {
    router.push("/cart")
    onClose()
  }

  // Navigate to checkout page
  const goToCheckout = () => {
    router.push("/checkout")
    onClose()
  }

  if (!isOpen) return null

  // If showing success modal
  if (showSuccessModal && addedItem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
                  src={addedItem.product.image || "/placeholder.svg"}
                  alt={addedItem.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-medium mb-2">{addedItem.product.name}</h3>
                <p className="text-gray-500 mb-1">Color: {addedItem.selectedColor}</p>
                <p className="text-gray-500 mb-2">Size: {addedItem.selectedSize}</p>
                <p className="font-medium">${addedItem.product.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={goToCart}>
                View cart
              </Button>
              <Button className="w-full" onClick={goToCheckout}>
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

  return (
    <div
      className={`fixed inset-0 z-50 flex ${isMobile ? "items-end" : "items-start justify-end"}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        ref={modalRef}
        className={`bg-white overflow-auto ${
          isMobile ? "w-full h-[90vh] rounded-t-xl animate-slide-up" : "w-[30rem] h-full animate-slide-right"
        }`}
      >
        {/* Close button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100"
            style={{
              top: isMobile ? "10px" : "16px", // Adjusted for mobile view
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shop the Look Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">Shop the Look</h2>
        </div>

        {/* Product Thumbnails - Only show the products in this look */}
        <div className="flex gap-2 p-4 border-b overflow-x-auto">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={cn(
                "flex-shrink-0 w-16 h-16 relative rounded overflow-hidden border-2",
                product.id === selectedProduct.id ? "border-black" : "border-transparent",
              )}
            >
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Product Image and Name Section */}
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-1/2 p-4">
            <div
              className="relative w-full h-[340px] md:h-[350px] mx-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={selectedProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30rem"
              />

              {/* Image Navigation Dots */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                {allImages.map((_, idx) => {
                  if (idx <= 1 || idx === currentImageIndex) {
                    return (
                      <div
                        key={idx}
                        className={cn("w-2 h-2 rounded-full border border-black transition-all duration-300", {
                          "bg-black": idx === currentImageIndex,
                          "bg-transparent": idx !== currentImageIndex,
                          "opacity-60": idx > 1,
                        })}
                      />
                    )
                  }
                  return null
                })}
              </div>

              {/* Product Badge */}
              {selectedProduct.badge && (
                <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-xs font-bold rounded-sm">
                  {selectedProduct.badge}
                </div>
              )}

              {/* Desktop Navigation Arrows */}
              {!isMobile && allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product Name and Price */}
          <div className="w-full md:w-1/2 p-4 mt-6 md:mt-0">
            <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-gray-500 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Stock Status */}
          <div className="mb-4">
            {selectedProduct.inStock ? (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm text-green-600">In stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-sm text-red-600">Out of stock</span>
              </div>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">COLOR</span>
              <span>{selectedColor}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {selectedProduct.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`relative aspect-square border-2 ${
                    selectedColor === color.name ? "border-black" : "border-gray-200"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={color.image || "/placeholder.svg"}
                      alt={color.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 5vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">SIZE</span>
              <button onClick={handleSizeGuideClick} className="text-sm text-gray-600 underline">
                SIZE GUIDE
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {selectedProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 border ${
                    selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <span className="font-medium block mb-2">Quantity</span>
            <div className="flex border rounded-md w-fit">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 border-r">
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 text-center"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 border-l">
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">{selectedProduct.description}</p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-0 p-4 bg-white border-t mt-auto">
          <Button onClick={handleAddToCart} className="w-full bg-black hover:bg-black/90 text-white py-6">
            ADD TO CART • ${(selectedProduct.price * quantity).toFixed(2)}
          </Button>
          <button
            onClick={() => {
              window.location.href = `/product/${selectedProduct.id}`
            }}
            className="block w-full text-center mt-3 text-gray-600 underline"
          >
            View all details
          </button>
        </div>
      </div>
    </div>
  )
}
