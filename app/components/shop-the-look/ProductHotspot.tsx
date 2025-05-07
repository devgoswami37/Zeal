"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/lib/types"
import { cn } from "@/lib/utils"

interface ProductHotspotProps {
  position: {
    x: number
    y: number
  }
  product: Product
  isSelected: boolean
  onClick: () => void
  onQuickBuy: () => void
}

export function ProductHotspot({ position, product, isSelected, onClick, onQuickBuy }: ProductHotspotProps) {
  const [showCard, setShowCard] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowCard(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleHotspotClick = () => {
    onClick()
    if (isMobile) {
      onQuickBuy()
    } else {
      setShowCard(!showCard)
    }
  }

  const getCardPosition = () => {
    const isRightSide = position.x > 50
    const isBottomHalf = position.y > 50

    return {
      left: isRightSide ? "auto" : "calc(100% - 15rem)",
      right: isRightSide ? "calc(100% - 14rem)" : "auto",
      top: isBottomHalf ? "auto" : "-80px",
      bottom: isBottomHalf ? "-80px" : "auto",
    }
  }

  const getLineStyle = () => {
    const isRightSide = position.x > 50

    if (isMobile) {
      if (product.id === 28) {
        return {
          width: "45px",
          transform: "rotate(10deg)",
          transformOrigin: "revert-layer",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          borderWidth: "1px",
          borderColor: "white",
        }
      } else if (product.id === 29) {
        return {
          width: "45px",
          transform: "rotate(-10deg)",
          transformOrigin: "revert",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          marginLeft: "18px",
          borderWidth: "1px",
          borderColor: "white",
        }
      } else if (product.id === 30) {
        return {
          width: "45px",
          transform: "rotate(10deg)",
          transformOrigin: "initial",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          borderWidth: "1px",
          borderColor: "white",
        }
      }
    } else {
      if (product.id === 28) {
        return {
          width: "60px",
          transform: "rotate(15deg)",
          transformOrigin: "revert-layer",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          borderWidth: "1px",
          borderColor: "white",
        }
      } else if (product.id === 29) {
        return {
          width: "60px",
          transform: "rotate(-17deg)",
          transformOrigin: "revert",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          marginLeft: "22px",
          borderWidth: "1px",
          borderColor: "white",
        }
      } else if (product.id === 30) {
        return {
          width: "60px",
          transform: "rotate(16deg)",
          transformOrigin: "initial",
          left: isRightSide ? "100%" : "auto",
          right: isRightSide ? "auto" : "100%",
          borderWidth: "1px",
          borderColor: "white",
        }
      }
    }

    return {}
  }

  const getLabelStyle = () => {
    const isRightSide = position.x > 50

    if (isMobile) {
      if (product.id === 28) {
        return {
          left: isRightSide ? `calc(100% + 50px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 45px)`,
          transform: "translateY(-75%)",
        }
      } else if (product.id === 29) {
        return {
          left: isRightSide ? `calc(100% + 55px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 55px)`,
          transform: "translateY(-60%)",
        }
      } else if (product.id === 30) {
        return {
          left: isRightSide ? `calc(100% + 50px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 45px)`,
          transform: "translateY(-65%)",
        }
      }
    } else {
      if (product.id === 28) {
        return {
          left: isRightSide ? `calc(100% + 63px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 59px)`,
          transform: "translateY(-90%)",
        }
      } else if (product.id === 29) {
        return {
          left: isRightSide ? `calc(100% + 68px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 68px)`,
          transform: "translateY(-71%)",
        }
      } else if (product.id === 30) {
        return {
          left: isRightSide ? `calc(100% + 65px)` : "auto",
          right: isRightSide ? "auto" : `calc(100% + 53px)`,
          transform: "translateY(-75%)",
        }
      }
    }

    return {}
  }

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Hotspot */}
      <button
        onClick={handleHotspotClick}
        className={cn("hotspot-button relative", isSelected || showCard ? "z-30" : "z-20")}
      >
        {/* Inner circle */}
        <span className="hotspot-inner"></span>

        {/* Outer circle */}
        <span className="hotspot-outer"></span>

        {/* Pulse animations */}
        <span className="pulse pulse-1"></span>
        <span className="pulse pulse-2"></span>
        <span className="pulse pulse-3"></span>
      </button>

      {/* Product Label with dotted line */}
      <div className="absolute top-0 left-0">
        <div
          className="absolute top-1/2 border-t border-dashed pointer-events-none"
          style={getLineStyle()}
          data-product-id={product.id}
        ></div>

        <button
          onClick={handleHotspotClick}
          className="absolute top-1/2 whitespace-nowrap bg-white rounded-full px-3 py-1 text-sm font-medium shadow-md flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
          style={getLabelStyle()}
          data-product-id={product.id}
        >
          {product.name}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Product Card (Desktop) */}
      {!isMobile && showCard && (
        <div
          ref={cardRef}
          className="absolute w-80 bg-white rounded-lg shadow-lg overflow-hidden z-30"
          style={getCardPosition()}
        >
          <div className="flex p-2">
            <div className="w-1/2 relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <div className="w-1/2 pl-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base">{product.name}</h3>
                <p className="font-medium text-base mt-1">${product.price.toFixed(2)}</p>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickBuy()
                  setShowCard(false)
                }}
                variant="outline"
                className="w-full mt-3 border-black text-black hover:bg-gray-100"
              >
                QUICK BUY
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hotspot-button {
          width: 24px;
          height: 24px;
          position: relative;
          cursor: pointer;
        }

        .hotspot-inner {
          position: absolute;
          width: 9px;
          height: 9px;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
        }

        .hotspot-outer {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid white;
          border-radius: 50%;
          top: 0;
          left: 0;
          z-index: 10;
        }

        .pulse {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pulse-1 {
          inset: 0;
          animation-delay: 0s;
        }

        .pulse-2 {
          inset: -4px;
          background-color: rgba(255, 255, 255, 0.3);
          animation-delay: 0.5s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        .hotspot-button:hover .pulse {
          animation-play-state: paused;
        }

        .hotspot-button::after {
          content: '';
          position: absolute;
          inset: -15px;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hotspot-button:hover::after {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default function FeatureBoxes() {
  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20 pb-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FeatureBox
            title="Effortlessly Chic"
            subtitle="Refresh your closet with wardrobe staples"
            topText="MIX AND MATCH"
            buttonText="SHOP NOW"
            buttonLink="/collections/chic"
            imageSrc="https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/products/creator-sweater-black-tops-alohas-504098.jpg?v=1666705111&width=738"
          />
          <FeatureBox
            title="Essentials only"
            subtitle="Easy additions to incorporate into your closet."
            topText="THE BEST BASICS"
            buttonText="SHOP ESSENTIALS"
            buttonLink="/collections/essentials"
            imageSrc="https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/products/tabloid-top-nutmeg-brown-tops-alohas-863102.jpg?v=1666709754&width=670"
          />
        </div>
      </div>
    </section>
  )
}
