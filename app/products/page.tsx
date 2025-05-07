"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "../components/ProductCard"
import { CategoryFilter } from "../components/CategoryFilter"
import Header from "../components/header"
import { getProducts, getCategories } from "@/lib/data-service"
import LoadingSpinner from "../components/loading-spinner"
import type { Product } from "../lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedProducts, fetchedCategories] = await Promise.all([getProducts(), getCategories()])

        setProducts(fetchedProducts)
        setFilteredProducts(fetchedProducts)
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (category: string) => {
    if (category === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === category))
    }
  }

  return (
    <div>
      <Header />
      <div className="container max-w-6xl mx-auto p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <CategoryFilter categories={categories} onFilterChange={handleFilterChange} />

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No products found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
