"use client"

import { useState } from "react"
import Image from "next/image"

interface CarouselProps {
  images: string[]
}

export function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Product image ${currentIndex + 1}`}
          width={600}
          height={600}
          className="w-full h-auto"
        />
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
      >
        &#10095;
      </button>
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full mx-1 ${index === currentIndex ? "bg-gray-800" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  )
}
