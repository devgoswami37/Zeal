"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { ShopTheLook as ShopTheLookType } from "@/app/data/shop-the-look"
import type { Product } from "@/app/lib/types"
import { ProductHotspot } from "./ProductHotspot"
import { ShopTheLookModal } from "./ShopTheLookModal"

interface ShopTheLookProps {
  look: ShopTheLookType
  products: Product[]
}

export function ShopTheLook({ look, products }: ShopTheLookProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleHotspotClick = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setSelectedProduct(product)
    }
  }

  const handleQuickBuy = (product: Product) => {
    // Ensure we're setting the selected product before showing the modal
    setSelectedProduct(product)

    // Use setTimeout to ensure state is updated before showing modal
    setTimeout(() => {
      setShowModal(true)
    }, 0)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Filter to get only the products in this look
  // Use a more explicit filtering to ensure we only get the exact products in the look
  const lookProducts = products.filter((product) => look.products.some((p) => p.id === product.id))

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
        <Image src={look.image || "/placeholder.svg"} alt={look.name} fill className="object-cover" priority />

        {/* Product Hotspots */}
        {look.products.map((lookProduct) => {
          const product = products.find((p) => p.id === lookProduct.id)
          if (!product) return null

          return (
            <ProductHotspot
              key={lookProduct.id}
              position={lookProduct.position}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onClick={() => handleHotspotClick(lookProduct.id)}
              onQuickBuy={() => handleQuickBuy(product)}
            />
          )
        })}
      </div>

      {/* Shop the Look Modal */}
      {selectedProduct && showModal && (
        <ShopTheLookModal
          products={lookProducts}
          initialProductId={selectedProduct.id}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
