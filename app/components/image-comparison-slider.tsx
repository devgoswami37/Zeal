"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface ImageComparisonSliderProps {
  leftImage: string
  rightImage: string
  leftLabel: string
  rightLabel: string
  productName: string
  productPrice: number
  productLink: string
}

export default function ImageComparisonSlider({
  leftImage,
  rightImage,
  leftLabel,
  rightLabel,
  productName,
  productPrice,
  productLink,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const calculateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return

    const { left, width } = containerRef.current.getBoundingClientRect()
    let position = ((clientX - left) / width) * 100

    // Clamp the position between 0 and 100
    position = Math.max(0, Math.min(position, 100))
    setSliderPosition(position)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    calculateSliderPosition(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return
    calculateSliderPosition(e.touches[0].clientX)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div className="relative w-full overflow-hidden rounded-lg h-full" ref={containerRef}>
      {/* Product labels - now with conditional visibility based on slider position */}
      <div
        className="absolute top-4 left-4 z-10 text-sm font-medium bg-white/80 px-2 py-1 rounded transition-opacity duration-200"
        style={{ opacity: sliderPosition < 38 ? 0 : 1 }}
      >
        {leftLabel}
      </div>
      <div
        className="absolute top-4 right-4 z-10 text-sm font-medium bg-white/80 px-2 py-1 rounded transition-opacity duration-200"
        style={{ opacity: sliderPosition > 68 ? 0 : 1 }}
      >
        {rightLabel}
      </div>

      {/* Left image (full width) */}
      <div className="relative w-full h-full" style={{ aspectRatio: "3/4" }}>
        <Image
          src={leftImage || "/placeholder.svg"}
          alt={leftLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Right image (clipped) with smooth transition */}
      <div className="absolute top-0 right-0 h-full overflow-hidden" style={{ width: `${100 - sliderPosition}%` }}>
        <div
          className="relative h-full"
          style={{
            width: `${(100 / (100 - sliderPosition)) * 100}%`,
            left: `-${(sliderPosition / (100 - sliderPosition)) * 100}%`,
          }}
        >
          <Image
            src={rightImage || "/placeholder.svg"}
            alt={rightLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Slider control with three black lines */}
      <div
        className="absolute top-0 bottom-0 w-[0.15rem] bg-white cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className="flex flex-row items-center space-x-1">
            <div className="w-0.5 h-5 bg-black rounded-full"></div>
            <div className="w-0.5 h-5 bg-black rounded-full"></div>
            <div className="w-0.5 h-5 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
