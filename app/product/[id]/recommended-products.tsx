"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/app/components/ProductCard"
import { getRecommendedProducts } from "@/lib/data-service"
import type { Product } from "@/app/lib/types"
import LoadingSpinner from "@/app/components/loading-spinner"

export default function RecommendedProducts({
  productId,
  category,
}: {
  productId: string | number
  category: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendedProducts() {
      try {
        setLoading(true)
        const recommendedProducts = await getRecommendedProducts(productId, category, 4)
        setProducts(recommendedProducts)
      } catch (error) {
        console.error("Error fetching recommended products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [productId, category])

  if (loading) {
    return <LoadingSpinner />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
