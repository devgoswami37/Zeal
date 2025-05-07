"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import type { Product } from "@/app/lib/types"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { QuickBuyModal } from "./QuickBuyModal"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const addToCartRef = useRef<HTMLButtonElement>(null)
  const { addToCart } = useCart()
  const [showQuickBuyModal, setShowQuickBuyModal] = useState(false)

  // Get all product images
  const allImages = [product.image, product.hoverImage, ...(product.additionalImages || [])].filter(Boolean) as string[]

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Set up GSAP animations
  useEffect(() => {
    if (!cardRef.current || typeof window === "undefined") return

    // Apply different x movement based on index % 2 (even for right, odd for left)
    const xMovement = index % 2 === 0 ? 10 : 30 // Right side (index % 2 === 0) starts from 10 (smaller movement), Left side (index % 2 !== 0) starts from 30 (larger movement)

    // Initial state - hide cards that aren't the first one
    if (index !== 0) {
      gsap.set(cardRef.current, {
        x: xMovement, // Apply dynamic x movement based on the index % 2
        opacity: 0,
      })
    }

    // Create animation for the card
    const cardAnimation = gsap.to(cardRef.current, {
      x: 0, // End position will always be at x: 0
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      paused: true,
    })

    // Create animation for the add to cart button
    if (addToCartRef.current) {
      gsap.set(addToCartRef.current, {
        opacity: 0,
        y: 5,
      })
    }

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 80%", // Start animation when the top of the card is 80% from the top of the viewport
      onEnter: () => {
        // Animate the card
        cardAnimation.play()

        // Animate the add to cart button with a delay based on index
        if (addToCartRef.current) {
          gsap.to(addToCartRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.3 + index * 0.1, // Stagger the button animations
            ease: "power2.out",
          })
        }
      },
      once: true, // Only trigger once
    })

    return () => {
      // Clean up
      trigger.kill()
    }
  }, [index])

  // Touch handlers for mobile swipe
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

  // Reset image index when mouse leaves on desktop
  const handleMouseLeave = () => {
    if (!isMobile) {
      setCurrentImageIndex(0)
      setShowAddToCart(false)
    }
  }

  // Handle hover for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (allImages.length > 1) {
        setCurrentImageIndex(1)
      }
      setShowAddToCart(true)
    }
  }

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickBuyModal(true)
  }

  return (
    <>
      <Link href={`/product/${product.id}`} className="block">
        <div
          ref={cardRef}
          className="product-card bg-white rounded-lg border border-gray-100 overflow-hidden relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image Container */}
          <div
            className="relative w-full h-[240px] md:h-[350px] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Current Image */}
            <Image
              src={allImages[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-opacity duration-300 ease-in-out"
            />

            {/* Product Badge - only show if product has a badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-xs font-bold rounded-sm">
                {product.badge}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              ref={addToCartRef}
              onClick={handleAddToCart}
              className={cn(
                "absolute bottom-4 right-4 bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 ease-in-out",
                !isMobile && (showAddToCart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"),
              )}
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>

            {/* Mobile Image Navigation Dots */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 md:hidden">
              {allImages.map((_, idx) => {
                // Only show first two dots or current dot if it's beyond first two
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
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="product-name text-base mb-2">{product.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice !== product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Render QuickBuyModal outside of the Link component */}
      {showQuickBuyModal && (
        <QuickBuyModal product={product} isOpen={showQuickBuyModal} onClose={() => setShowQuickBuyModal(false)} />
      )}
    </>
  )
}
