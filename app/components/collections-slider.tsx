"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { COLLECTION_IMAGES } from "../data/collections"

export default function CollectionsSlider() {
  const productListRef = useRef<HTMLDivElement>(null)
  const scrollbarThumbRef = useRef<HTMLDivElement>(null)
  const sliderScrollbarRef = useRef<HTMLDivElement>(null)
  const [collections, setCollections] = useState<any[]>([])

// Fetch products from the backend
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products") // Replace with your API endpoint
      const products: { category: string }[] = await response.json() // Define the type of products

      // Generate collections with custom images
      const uniqueCollections = Array.from(
        new Set(products.map((product) => product.category))
      ).map((category: string) => {
        const slug = category.toLowerCase().replace(/\s+/g, "-") // No more type error
        const collectionInfo = COLLECTION_IMAGES[slug]

        return {
          id: category,
          name: category,
          image: collectionInfo?.displayImage || "/placeholder.svg", // Use image from collections data
          slug: slug,
        }
      })

      setCollections(uniqueCollections)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  fetchProducts()
}, [])

  const updateScrollThumbPosition = () => {
    if (!productListRef.current || !sliderScrollbarRef.current || !scrollbarThumbRef.current) return

    const scrollPosition = productListRef.current.scrollLeft
    const maxScrollLeft = productListRef.current.scrollWidth - productListRef.current.clientWidth
    const scrollbarWidth = sliderScrollbarRef.current.clientWidth
    const thumbWidth = scrollbarThumbRef.current.offsetWidth

    const thumbPosition = (scrollPosition / maxScrollLeft) * (scrollbarWidth - thumbWidth)
    scrollbarThumbRef.current.style.left = `${thumbPosition}px`
  }

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const startX = e.clientX
    const thumbPosition = scrollbarThumbRef.current?.offsetLeft || 0

    const handleMouseMove = (e: MouseEvent) => {
      if (!productListRef.current || !sliderScrollbarRef.current || !scrollbarThumbRef.current) return

      const deltaX = e.clientX - startX
      const scrollbarWidth = sliderScrollbarRef.current.clientWidth
      const thumbWidth = scrollbarThumbRef.current.offsetWidth
      const maxThumbPosition = scrollbarWidth - thumbWidth

      const newThumbPosition = Math.max(0, Math.min(maxThumbPosition, thumbPosition + deltaX))
      const scrollPosition =
        (newThumbPosition / maxThumbPosition) *
        (productListRef.current.scrollWidth - productListRef.current.clientWidth)

      productListRef.current.scrollLeft = scrollPosition
      scrollbarThumbRef.current.style.left = `${newThumbPosition}px`
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  useEffect(() => {
    const productList = productListRef.current
    if (productList) {
      productList.addEventListener("scroll", updateScrollThumbPosition)
    }

    return () => {
      if (productList) {
        productList.removeEventListener("scroll", updateScrollThumbPosition)
      }
    }
  }, [])

  return (
    <div className="mt-28 mb-16">
      <div className="w-full pl-[5vw]">
        <div className="flex justify-between items-center mb-6 pr-[3vw]">
          <h2 className="text-2xl font-medium">Shop Collections</h2>
          <Link href="/collections" className="text-primary">
            View All
          </Link>
        </div>

        <div className="relative">
          <div
            ref={productListRef}
            className="flex overflow-x-auto scrollbar-hide pb-5 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {collections.map((collection) => (
              <div key={collection.id} className="flex-none mr-[1vw]">
                <Link href={`/collections/${collection.slug}`} className="block">
                  <div className="relative w-[305px] h-[380px] md:w-[350px] md:h-[420px]">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center text-lg">{collection.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div ref={sliderScrollbarRef} className="w-[80%] h-1 bg-gray-300 mt-5 mx-auto relative rounded">
          <div
            ref={scrollbarThumbRef}
            className="absolute h-full w-[20%] bg-black rounded cursor-grab active:cursor-grabbing"
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      </div>
    </div>
  )
}