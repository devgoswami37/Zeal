"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react"
import Image from "next/image"
import { useSwipe } from "@/app/hooks/useSwipe"
import { cn } from "@/lib/utils"

interface ProductImageCarouselProps {
  images: string[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

const ProductImageCarousel = forwardRef<any, ProductImageCarouselProps>(
  ({ images = [], currentIndex = 0, onIndexChange }, ref) => {
    const [activeIndex, setActiveIndex] = useState(currentIndex)
    const [isDragging, setIsDragging] = useState(false)
    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(true)
    const dragStartX = useRef(0)
    const dragCurrentX = useRef(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const thumbnailsRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number) => {
        handleDotClick(index)
      },
    }))

    useEffect(() => {
      if (currentIndex !== activeIndex) {
        setActiveIndex(currentIndex)
      }
    }, [currentIndex, activeIndex])

    const handleThumbnailScroll = useCallback(() => {
      if (thumbnailsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current
        setShowLeftFade(scrollLeft > 0)
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }, [])

    useEffect(() => {
      const thumbnailsContainer = thumbnailsRef.current
      if (thumbnailsContainer) {
        thumbnailsContainer.addEventListener("scroll", handleThumbnailScroll)
        handleThumbnailScroll()
        return () => thumbnailsContainer.removeEventListener("scroll", handleThumbnailScroll)
      }
    }, [handleThumbnailScroll])

    useEffect(() => {
      const centerThumbnail = () => {
        if (thumbnailsRef.current) {
          const container = thumbnailsRef.current
          const thumbnail = container.children[activeIndex] as HTMLElement
          if (!thumbnail) return

          const containerWidth = container.offsetWidth
          const thumbnailWidth = thumbnail.offsetWidth
          const scrollWidth = container.scrollWidth
          const maxScroll = scrollWidth - containerWidth

          let scrollLeft = thumbnail.offsetLeft - (containerWidth - thumbnailWidth) / 2

          if (activeIndex <= 2) {
            scrollLeft = 0
          } else if (activeIndex >= images.length - 3) {
            scrollLeft = maxScroll
          }

          scrollLeft = Math.max(0, Math.min(scrollLeft, maxScroll))

          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          })
        }
      }

      centerThumbnail()
    }, [activeIndex, images.length])

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
      setIsDragging(true)
      dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX
      dragCurrentX.current = 0
    }

    const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return

      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX
      dragCurrentX.current = currentX - dragStartX.current

      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth
        dragCurrentX.current = Math.max(
          Math.min(dragCurrentX.current, containerWidth * 0.8),
          -containerWidth * 0.8
        )

        const carouselImages = carouselRef.current.getElementsByClassName("carousel-image")
        Array.from(carouselImages).forEach((img, index) => {
          const element = img as HTMLElement
          const baseOffset = (index - activeIndex) * 100
          const dragOffset = (dragCurrentX.current / containerWidth) * 100
          element.style.transform = `translateX(calc(${baseOffset}% + ${dragOffset}%))`
        })
      }
    }

    const handleDragEnd = () => {
      if (!isDragging) return
      setIsDragging(false)

      const containerWidth = carouselRef.current?.offsetWidth || 0
      const dragThreshold = containerWidth * 0.2

      if (Math.abs(dragCurrentX.current) > dragThreshold) {
        const newIndex = dragCurrentX.current > 0
          ? Math.max(0, activeIndex - 1)
          : Math.min(images.length - 1, activeIndex + 1)
        handleDotClick(newIndex)
      }

      if (carouselRef.current) {
        const carouselImages = carouselRef.current.getElementsByClassName("carousel-image")
        Array.from(carouselImages).forEach((img, index) => {
          const element = img as HTMLElement
          element.style.transform = `translateX(${(index - activeIndex) * 100}%)`
        })
      }
    }
    const handleDotClick = (index: number) => {
      setActiveIndex(index)
      if (onIndexChange) {
        onIndexChange(index)
      }
    }

    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe((direction) => {
      if (direction === "left") {
        handleDotClick(Math.min(images.length - 1, activeIndex + 1))
      } else {
        handleDotClick(Math.max(0, activeIndex - 1))
      }
    })

    return (
      <div className="w-full container">
        {/* Main Carousel */}
        <div
          ref={carouselRef}
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: "133.75%" }}
          onTouchStart={(e) => {
            onTouchStart(e)
            handleDragStart(e)
          }}
          onTouchMove={(e) => {
            onTouchMove(e)
            handleDragMove(e)
          }}
          onTouchEnd={(e) => {
            onTouchEnd(e)
            handleDragEnd()
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cn(
                "carousel-image absolute top-0 left-0 w-full h-full select-none",
                "transition-transform duration-300 ease-out",
                isDragging ? "transition-none" : ""
              )}
              style={{
                transform: `translateX(${(index - activeIndex) * 100}%)`,
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                draggable="false"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        {/* Thumbnails Section */}
        <div className="relative mt-4 px-4">
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none",
              showLeftFade ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none",
              showRightFade ? "opacity-100" : "opacity-0"
            )}
          />

          <div className="px-0">
            <div
              ref={thumbnailsRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth pb-2 justify-center gap-2"
            >
              {images.map((image, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => handleDotClick(index)}
                  className="relative flex-shrink-0"
                  style={{ width: "52px" }}
                >
                  <div 
                    className="absolute inset-0 rounded-[14px] border-2 border-[#dca23f] border-[1.3px]"
                    style={{ marginTop: "8px" }}
                  />
                  <div 
                    className="relative w-full aspect-[0.8]"
                    style={{ marginTop: "8px" }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover rounded-[14px] scale-95"
                      draggable="false"
                      sizes="52px"
                    />
                  </div>
                  {index === activeIndex && (
                    <div
                      className="absolute inset-0 -m-1 rounded-[16px] border-2 border-black"
                      style={{ marginTop: "4px" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Mobile Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-black" : "bg-gray-300"}`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : "false"}
            />
          ))}
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    )
  }
)

ProductImageCarousel.displayName = "ProductImageCarousel"

export { ProductImageCarousel }
export default ProductImageCarousel
