"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, X, QrCode, Search } from "lucide-react"
import { findRelatedTags, isMatchingTag } from "../lib/tags"
import Link from "next/link"
import debounce from "lodash/debounce"
import { ProductCard } from "../components/ProductCard"
import Header from "../components/header"

const popularCategories = [
  {
    name: "Women",
    image: "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/one-piece_1950x.jpg?v=1652113013",
    link: "/collections/outerwear",
  },
  {
    name: "Men",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/men",
  },
  {
    name: "Kids",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/kids",
  },
  {
    name: "Sunglasses",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/sunglasses",
  },
  {
    name: "Home",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/home",
  },
  {
    name: "Hot Brands",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/hot-brands",
  },
]

const trendingSearches = ["Shirts", "Dresses", "Jeans", "Jackets", "Swimwear", "T-Shirts", "Accessories", "Shoes"]

interface Product {
  id: string
  name: string
  description: string
  category: string
  mainTags: string[]
  image: string
  price: number
  originalPrice: number
}

interface SearchState {
  suggestions: string[]
  previewProducts: Product[]
  searchResults: Product[]
  isSearchSubmitted: boolean
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [searchState, setSearchState] = useState<SearchState>({
    suggestions: [],
    previewProducts: [],
    searchResults: [],
    isSearchSubmitted: false,
  })
  const isFirstRender = useRef(true)

  // Fetch products from the API
  useEffect(() => {
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
  }, [])

  const performSearch = (term: string) => {
    const normalizedTerm = term.toLowerCase()

    // Get tag-based suggestions
    const suggestions = findRelatedTags(normalizedTerm)

    // Search products
    const matchingProducts = products.filter((product) => {
      const basicMatch = [
        product.name.toLowerCase(),
        product.description.toLowerCase(),
        product.category.toLowerCase(),
      ].some((text) => text.includes(normalizedTerm))

      const tagMatch = isMatchingTag(normalizedTerm, product.mainTags)

      return basicMatch || tagMatch
    })

    return {
      suggestions,
      matchingProducts,
    }
  }

  // Create a stable debounced search function for preview results
  const debouncedPreviewSearch = useCallback(
    debounce((term: string) => {
      if (term.length > 0) {
        const { suggestions, matchingProducts } = performSearch(term)
        setSearchState((prev) => ({
          ...prev,
          suggestions,
          previewProducts: matchingProducts.slice(0, 2), // Only show 2 preview products
          isSearchSubmitted: false,
        }))
      } else {
        setSearchState({
          suggestions: [],
          previewProducts: [],
          searchResults: [],
          isSearchSubmitted: false,
        })
      }
    }, 300),
    [products],
  )

  // Handle URL query parameter changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      const query = searchParams?.get("q")

      if (query) {
        setInputValue(query)
        const { suggestions, matchingProducts } = performSearch(query)
        setSearchState({
          suggestions,
          previewProducts: [],
          searchResults: matchingProducts,
          isSearchSubmitted: true,
        })
      }
    }
  }, [searchParams, products])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedPreviewSearch(value)
  }

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const { matchingProducts } = performSearch(inputValue.trim())
      setSearchState((prev) => ({
        ...prev,
        searchResults: matchingProducts,
        isSearchSubmitted: true,
      }))
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    const { matchingProducts } = performSearch(suggestion)
    setSearchState({
      suggestions: [],
      previewProducts: [],
      searchResults: matchingProducts,
      isSearchSubmitted: true,
    })
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  // Handle back button
  const handleBack = () => {
    router.back()
  }

  // Clear search
  const handleClear = () => {
    setInputValue("")
    setSearchState({
      suggestions: [],
      previewProducts: [],
      searchResults: [],
      isSearchSubmitted: false,
    })
    router.push("/search")
  }

  // Listen for popstate events (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const query = new URLSearchParams(window.location.search).get("q")
      if (query) {
        setInputValue(query)
        const { suggestions, matchingProducts } = performSearch(query)
        setSearchState({
          suggestions,
          previewProducts: [],
          searchResults: matchingProducts,
          isSearchSubmitted: true,
        })
      } else {
        setInputValue("")
        setSearchState({
          suggestions: [],
          previewProducts: [],
          searchResults: [],
          isSearchSubmitted: false,
        })
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [products])

  const showInitialPage = !inputValue && !searchState.isSearchSubmitted
  const showSearchResults = searchState.isSearchSubmitted
  const showPreviewResults = !showInitialPage && !showSearchResults

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show header when search results are displayed */}
      {showSearchResults && <Header />}

      {/* Only show search box when not showing search results */}
      {!showSearchResults && (
        <div className="bg-white sticky top-0 z-50 px-4 py-3 flex items-center gap-3 border-b">
          <button onClick={handleBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search for products, brands and more..."
                className="w-full py-2 pl-4 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {inputValue && (
                <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            <button type="submit" className="p-2">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <button className="p-2">
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className={`p-4 ${showSearchResults ? "pt-20" : ""}`}>
        {showInitialPage ? (
          // Initial Search Page
          <div>
            {/* Trending Searches */}
            <section className="mb-8">
              <h2 className="text-sm font-bold mb-4">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-4 py-2 rounded-full border hover:bg-gray-100"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {/* Popular Categories */}
            <section>
              <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
              <div className="grid grid-cols-3 gap-4">
                {popularCategories.map((category) => (
                  <Link key={category.name} href={category.link} className="text-center space-y-2">
                    <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium">{category.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : showSearchResults ? (
          // Full Search Results Page
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {searchState.searchResults.length} RESULTS FOR "{inputValue}"
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {searchState.searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          // Preview Results while typing
          <div>
            {/* Search Suggestions */}
            {searchState.suggestions.length > 0 && (
              <div className="mb-6">
                {searchState.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-100 rounded-lg"
                  >
                    <span>{suggestion}</span>
                    <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
                  </button>
                ))}
              </div>
            )}

            {/* Preview Products */}
            {searchState.previewProducts.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">PRODUCTS</h3>
                <div className="space-y-4">
                  {searchState.previewProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}