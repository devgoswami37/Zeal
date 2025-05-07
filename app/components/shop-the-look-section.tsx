"use client"

import { useState, useEffect } from "react"
import { shopTheLooks } from "@/app/data/shop-the-look"
import { ShopTheLook } from "./shop-the-look/ShopTheLook"

export default function ShopTheLookSection() {
  const [isLoaded, setIsLoaded] = useState(false)
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
      }
    }

    fetchProducts()
    setIsLoaded(true)
  }, [])

  // Get the first look (we can add more later)
  const look = shopTheLooks[0]

  if (!isLoaded) return null

  return (
    <section className="px-4 py-4 md:py-16 pb-12">
      <div className="container mx-auto">
        <div className="rounded-lg overflow-hidden">
          <ShopTheLook look={look} products={products} />
        </div>
      </div>
    </section>
  )
}