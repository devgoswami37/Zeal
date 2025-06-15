"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { getProductsByCategory } from "@/lib/data-service"
import { ProductCard } from "@/app/components/ProductCard"
import Header from "@/app/components/header"
import { getCollectionInfo } from "@/app/data/collections"
import LoadingSpinner from "@/app/components/loading-spinner"
import type { Product } from "@/app/lib/types"

export default function CollectionPage() {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug || ""
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Get collection info with fallback
  const collection = getCollectionInfo(slugString)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        // Convert slug to category name for product filtering
        const categoryName = collection.title
        const collectionProducts = await getProductsByCategory(categoryName)
        setProducts(collectionProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slugString, collection.title])

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        {/* Collection Hero */}
        <div className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src={collection.backgroundImage || "/placeholder.svg"}
              alt={collection.title}
              fill
              className="object-cover brightness-75"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/20 to-black30"></div>
          </div>
          <div className="relative text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-light mb-4">{collection.title}</h1>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto px-4 text-lg font-light leading-relaxed">{collection.description}</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container max-w-6xl mx-auto p-4 mt-10">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found in this collection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
