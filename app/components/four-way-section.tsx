"use client"

import Link from "next/link"
import ImageComparisonSlider from "./image-comparison-slider"

export default function FourWaySection() {
  return (
    <section className="w-full pt-12 pb-6 md:pt-16 md:pb-10 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 lg:space-x-16">
          {/* Text content - stacked on mobile, side by side on desktop */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 mt-6 md:mt-0 order-2 md:order-1">
            <div className="max-w-lg">
              <h4 className="text-sm mb-4 font-medium uppercase tracking-wider mb-2">WEAR IT FOUR WAY</h4>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-2">AQUARIUS</h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-2">CRISSCROSS</h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic mb-6">FOUR-WAY TOP</h2>

              <p className="text-base mb-8">
                The results are in and green is the Wolfpack's favorite color. It's not surprising, considering that
                we're a group of eco-conscious, recycling-loving, tree-hugging.
              </p>

              <Link
                href="/collections/four-way-tops"
                className="inline-block bg-black text-white px-6 py-3 uppercase text-sm tracking-wider font-medium hover:bg-gray-800 transition-colors"
              >
                SHOP FOUR-WAY TOPS
              </Link>
            </div>
          </div>

          {/* Image comparison slider - stacked on mobile, side by side on desktop */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="h-[500px] md:h-[600px] lg:h-[700px] max-h-[130vh] md:max-h-[90vh]">
              <div className="h-[80%]">
                <ImageComparisonSlider
                  leftImage="https://zest-flairy.myshopify.com/cdn/shop/files/home-image-before.webp?v=1740017660&width=1500"
                  rightImage="https://zest-flairy.myshopify.com/cdn/shop/files/home-image-after.webp?v=1740017675&width=1100"
                  leftLabel="Turmeric Color"
                  rightLabel="Onyx Color"
                  productName="Turmeric Crisscross Bra"
                  productPrice={32.2}
                  productLink="/product/31"
                />
              </div>

              {/* Product info for both mobile and desktop */}
              <div className="mt-4 h-[15%]">
                <div className="flex justify-between items-center">
                  <Link href="/product/31" className="hover:underline">
                    <h3 className="text-lg font-medium">Turmeric Crisscross Bra</h3>
                  </Link>
                  <p className="text-sm font-medium">$32.20</p>
                </div>
                <div className="mt-2">
                  <Link
                    href="/product/31"
                    className="inline-block bg-black text-white px-4 py-2 mb-4 md:mb-0 text-sm hover:bg-gray-800 transition-colors"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
