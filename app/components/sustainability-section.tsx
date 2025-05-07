"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

export default function SustainabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-350px" })

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-white py-16 md:py-24"
      aria-labelledby="sustainability-heading"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          {/* Images container */}
          <div className="relative mb-8 md:mb-0 md:w-1/2">
            <div className="relative w-full min-h-[400px] md:h-[600px]">
              {/* First image */}
              <motion.div
                className="absolute left-0 top-0 z-20 w-[65%] md:w-[65%] overflow-hidden rounded-lg shadow-lg"
                initial={{ y: -100, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src="https://chantilly.myshopify.com/cdn/shop/files/planet.jpg?v=1619020466&width=1350"
                  alt="Woman in sustainable swimwear"
                  width={450}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </motion.div>

              {/* Second image */}
              <motion.div
                className="absolute right-0 z-10 w-[65%] md:w-[65%] overflow-hidden rounded-lg shadow-lg"
                style={{
                  top: "18%",
                }}
                initial={{ y: 100, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <Image
                  src="https://chantilly.myshopify.com/cdn/shop/files/145481217_200091641855594_4242286949372538483_n_854559bd-4c43-4560-9b19-5caa2c18e606.jpg?v=1617297634&width=600"
                  alt="Sustainable swimwear products"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>

          {/* Text content */}
          <motion.div
            className="md:w-1/2"
            initial={{ x: 20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <h2 id="sustainability-heading" className="text-3xl md:text-4xl font-light mb-6 text-gray-800">
              Better for the planet
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Committed to sustainability from the ground up. From recycled packaging, fibers, and even earth-inspired
              prints. Because we think swimwear should help clean up our waters, not pollute them.
            </p>

            <div className="mb-6">
              <Link
                href="/sustainability"
                className="text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors"
              >
                Learn more here
              </Link>
            </div>

            <Link
              href="/collections/sustainable"
              className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Shop the collection
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Optional: Add fallback CSS animations for when JS is disabled */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .no-js .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .no-js .animate-fade-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
