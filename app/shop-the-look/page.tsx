"use client"

import { useEffect, useState } from "react"
import { shopTheLooks, getProductsInLook } from "../data/shop-the-look"
import { ShopTheLook } from "../components/shop-the-look/ShopTheLook"
import Header from "../components/header"

export default function ShopTheLookPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Fetch products dynamically from the API
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          next: { revalidate: 60 }, // Cache for 60 seconds
        })
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Get the first look (we can add more later)
  const look = shopTheLooks[0]
  const lookProducts = getProductsInLook(look.id, products)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        <ShopTheLook look={look} products={lookProducts} />
      </div>
    </div>
  )
}