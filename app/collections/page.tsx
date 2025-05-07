"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import Header from "../components/header"
import { COLLECTION_IMAGES } from "@/app/data/collections" // Import COLLECTION_IMAGES

export default function CollectionsPage() {
  const [collections, setCollections] = useState<
    { title: string; slug: string; image: string; productCount: number }[]
  >([])

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/products", {
          next: { revalidate: 60 }, // Cache for 60 seconds
        })
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const products = await response.json()

        // Get unique categories from products
        const categories = Array.from(new Set(products.map((product: any) => product.category)))

        // Create collection items with slugs, images, and product counts
        const collectionsData = categories.map((category) => {
          const slug = category.toLowerCase().replace(/\s+/g, "-")
          const collectionInfo = COLLECTION_IMAGES[slug] || {
            title: category,
            displayImage: "/placeholder.svg",
          }

          // Count products in this category
          const productCount = products.filter(
            (product: any) => product.category.toLowerCase() === category.toLowerCase()
          ).length

          return {
            title: collectionInfo.title,
            slug,
            image: collectionInfo.displayImage,
            productCount,
          }
        })

        setCollections(collectionsData)
      } catch (error) {
        console.error("Error fetching collections:", error)
      }
    }

    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container w-full px-[4vw] pt-[6vh] mt-16">
        <div className="slider-header flex flex-col justify-center items-center mb-[5vh] relative">
          <h2 className="text-[6.6vw] md:text-[3.2vw] font-medium mb-[9px]">Collections</h2>
          <div className="header-line w-[40px] md:w-[30px] h-[2.2px] md:h-[2px] rounded-[14px] bg-black"></div>
        </div>

        <div className="product-list grid gap-[18px] pb-[20px] md:grid-cols-3">
          {collections.map((collection, index) => (
            <div key={index} className="product-item relative group mb-8 md:mb-0">
              <Link
                href={`/collections/${collection.slug}`}
                className="collection-link block h-full relative overflow-hidden"
              >
                {/* Image Container with Aspect Ratio */}
                <div className="aspect-[3/4] w-full relative">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    priority={index < 3}
                  />
                </div>

                {/* Desktop Overlay with Hover Effects */}
                <div className="hidden md:block absolute inset-0 bg-black/30 transition-all duration-500">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    {/* Title with upward animation */}
                    <h3 className="text-[24px] font-medium transform transition-all duration-500 group-hover:-translate-y-4">
                      {collection.title}
                    </h3>

                    {/* Product count and view button with fade-in and downward animation */}
                    <div className="flex flex-col items-center opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      <p className="text-sm mb-3">{collection.productCount} products</p>
                      <span className="inline-block px-6 py-2 bg-white text-black rounded-sm text-sm hover:bg-gray-100 transition-colors">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Mobile Title and Product Count */}
              <div className="md:hidden w-full mt-3 px-2 space-y-1">
                <span className="block text-center text-black text-[16px] font-light">{collection.title}</span>
                <span className="block text-center text-gray-500 text-sm">{collection.productCount} products</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .collection-link:hover .collection-image {
            transform: scale(1.1);
          }
          
          .collection-link:hover .collection-overlay {
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
        
        @media (max-width: 767px) {
          .slider-header {
            margin-bottom: 2.3vh;
          }
          .slider-header h2 {
            font-size: 6.6vw;
            margin-bottom: 9px;
            font-weight: 500;
          }
          .header-line {
            width: 40px;
            height: 2.2px;
            margin-bottom: 20px;
          }
          
          .product-item {
            height: auto;
            display: flex;
            flex-direction: column;
          }
          
          .collection-image {
            width: 100%;
            height: auto;
            aspect-ratio: 3/4;
          }
        }
      `}</style>
    </div>
  )
}