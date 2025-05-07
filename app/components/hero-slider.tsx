"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    desktopImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0005_Generative_Expand_Alt_2450x.jpg?v=1720533520",
    mobileImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0005_Generative_Expand_Alt_2450x.jpg?v=1720533520",
    alt: "Slide 1",
    smallHeading: "SUSTAINABLE SWIM",
    mainHeading: "Buy better. Wear more.",
    subtitle: "When it comes to sustainable swimwear, the future starts now!",
    buttonText: "Shop Collection",
    buttonLink: "/collections/sea-level-swim",
  },
  {
    id: 2,
    desktopImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase_Mila_Slideshow_Screenies_D_2450x.jpg?v=1720778611",
    mobileImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase_Mila_Slideshow_Screenies_D_2450x.jpg?v=1720778611",
    alt: "Slide 2",
    smallHeading: "NEW ARRIVALS",
    mainHeading: "Summer Collection 2025",
    subtitle: "Discover our latest styles for the perfect summer look",
    buttonText: "Shop New In",
    buttonLink: "/collections/new-arrivals",
  },
  {
    id: 3,
    desktopImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0008_Hue_Saturation_1_Crop_Alt_ed48ac54-8972-49a4-b14c-745eb49612a9_1950x.jpg?v=1720535290",
    mobileImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0008_Hue_Saturation_1_Crop_Alt_ed48ac54-8972-49a4-b14c-745eb49612a9_1950x.jpg?v=1720535290",
    alt: "Slide 3",
    smallHeading: "SUMMER ESSENTIALS",
    mainHeading: "Beach Ready Styles",
    subtitle: "Get ready for summer with our essential beach collection",
    buttonText: "Shop Now",
    buttonLink: "/collections/beach-essentials",
  },
  {
    id: 4,
    desktopImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0004_Layer_1_Vignette_1950x.jpg?v=1720532473",
    mobileImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/files/Showcase___Mila___Slideshow_0004_Layer_1_Vignette_1950x.jpg?v=1720532473",
    alt: "Slide 4",
    smallHeading: "LIMITED EDITION",
    mainHeading: "Exclusive Collection",
    subtitle: "Discover our limited edition pieces before they're gone",
    buttonText: "Shop Limited Edition",
    buttonLink: "/collections/limited-edition",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }

    if (touchStart - touchEnd < -75) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <div
      className="relative w-full h-[80vh] md:h-[92vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Desktop Image */}
          <div className="hidden md:block h-full">
            <Image
              src={slide.desktopImage || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.4)]"></div>
          </div>

          {/* Mobile Image */}
          <div className="block md:hidden h-full">
            <Image
              src={slide.mobileImage || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.4)]"></div>
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center mt-28">
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <div className="space-y-6">
                <p className="text-sm md:text-base tracking-widest uppercase">{slide.smallHeading}</p>
                <h2 className="text-4xl md:text-6xl font-light mb-4">{slide.mainHeading}</h2>
                <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 border-none rounded-none px-8 py-6 text-base"
                >
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`slider-dot ${index === currentSlide ? "active" : ""} text-white`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 30 30">
              <circle className="circle-one" cx="15" cy="15" r="13"></circle>
              <circle className="circle-two" cx="15" cy="15" r="13"></circle>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
