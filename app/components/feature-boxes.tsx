"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"

type FeatureBoxProps = {
  title: string
  subtitle: string
  topText: string
  buttonText: string
  buttonLink: string
  imageSrc: string
}

const FeatureBox = ({ title, subtitle, topText, buttonText, buttonLink, imageSrc }: FeatureBoxProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const typeTitle = useCallback(() => {
    if (inView && displayedTitle.length < title.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle((prevTitle) => {
          const nextTitle = title.substring(0, prevTitle.length + 1)
          if (nextTitle.length === title.length) {
            setIsTypingComplete(true)
          }
          return nextTitle
        })
      }, 25) // Slightly slower typing speed for smoother effect

      return () => clearTimeout(timeout)
    }
  }, [inView, displayedTitle, title])

  useEffect(() => {
    const cleanup = typeTitle()
    return () => {
      if (cleanup) cleanup()
    }
  }, [typeTitle])

  // Reset animation if component goes out of view and comes back
  useEffect(() => {
    if (!inView) {
      setDisplayedTitle("")
      setIsTypingComplete(false)
    }
  }, [inView])

  const renderTypingText = () => {
    if (displayedTitle.length === 0) return null

    return (
      <motion.span
        key="typing-text"
        className="typing-text inline-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayedTitle.split("").map((char, index) => (
          <motion.span
            key={`char-${index}`}
            className="inline-block"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} // Start fully hidden
            animate={{
              opacity: 1,
              clipPath: "inset(0 0% 0 0)", // Reveal from left to right
              transition: {
                duration: 0.3,
                delay: index * 0.05, // Staggered animation
                ease: "easeOut",
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with responsive height */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
        <div className="text-xs md:text-sm uppercase tracking-wider font-medium">{topText}</div>

        <div>
          <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 min-h-[1.2em]" layout>
            <AnimatePresence>{inView && renderTypingText()}</AnimatePresence>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: isTypingComplete ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm md:text-base mb-4 max-w-xs"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isTypingComplete ? 1 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Link
              href={buttonLink}
              className="inline-block uppercase text-xs md:text-sm tracking-wider py-2 px-4 border border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              {buttonText}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function FeatureBoxes() {
  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20 pb-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FeatureBox
            title="Effortlessly Chic"
            subtitle="Refresh your closet with wardrobe staples"
            topText="MIX AND MATCH"
            buttonText="SHOP NOW"
            buttonLink="/collections/chic"
            imageSrc="https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/products/creator-sweater-black-tops-alohas-504098.jpg?v=1666705111&width=738"
          />
          <FeatureBox
            title="Essentials only"
            subtitle="Easy additions to incorporate into your closet."
            topText="THE BEST BASICS"
            buttonText="SHOP ESSENTIALS"
            buttonLink="/collections/essentials"
            imageSrc="https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/products/tabloid-top-nutmeg-brown-tops-alohas-863102.jpg?v=1666709754&width=670"
          />
        </div>
      </div>
    </section>
  )
}
