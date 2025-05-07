"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const featureCards = [
  {
    id: 1,
    tagline: "EVERYDAY ESSENTIALS",
    title: "Designed to empower you to express your unique sense of style with confidence.",
    image:
      "https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/files/pipe-dream-black-tops-alohas-578862_dfcad7e0-2b8f-41b3-982f-c9a899cd12fe.jpg?v=1718727423&width=900",
    buttonText: "SHOP OUR COLLECTION",
    buttonLink: "/collections/outerwear",
  },
  {
    id: 2,
    tagline: "SUMMER 2024",
    title: "Stand out wherever you go. Our latest lookbook has dropped and is ready to shop.",
    image:
      "https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/products/java-vest-ivory-tops-alohas-795974_31d3d956-0314-44dd-b604-711e671734c0.jpg?v=1666894896&width=900",
    buttonText: "VIEW LOOKBOOK",
    buttonLink: "/collections/tops",
  },
  {
    id: 3,
    tagline: "NEW ARRIVALS",
    title: "Discover timeless pieces and chic ensembles to elevate your world.",
    image:
      "https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/files/melodrama-top-ivory-tops-alohas-377206_1.jpg?v=1718727842&width=900",
    buttonText: "SHOP BESTSELLERS",
    buttonLink: "/collections/sea-level-swim",
  },
]

export default function FeatureCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    // Clear any existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // Create animations for each card
    cards.forEach((card, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top+=${index * 100}% top`,
          end: `top+=${(index + 1) * 100}% top`,
          scrub: 0.5,
          // markers: true, // Uncomment for debugging
          invalidateOnRefresh: true,
        },
      })

      // Animate current card
      tl.to(
        card,
        {
          y: 0,
          ease: "power2.out",
          position: "sticky",
          top: 0,
          zIndex: index + 1,
        },
        0,
      )
    })

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)

    // Clean up on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col bg-faf5f0"
      style={{ height: "300vh" }} // Tall section to allow for scrolling
    >
      {featureCards.map((card, index) => (
        <div
          key={card.id}
          ref={(el) => (cardsRef.current[index] = el)}
          className="w-full h-screen flex items-center justify-center sticky top-0"
          style={{ backgroundColor: "#faf5f0", zIndex: index + 1 }}
        >
          {/* Mobile Layout (Image top, Text bottom) */}
          <div className="md:hidden flex flex-col h-full">
            <div className="relative w-full h-[62%] flex items-center justify-center p-6">
              <div className="relative w-full h-full max-h-[65vh] rounded-lg overflow-hidden">
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </div>
            <div className="h-[35%] flex flex-col justify-center px-6">
              <p className="text-xs tracking-widest mb-2">{card.tagline}</p>
              <h2 className="text-[1.8rem] font-bold mb-6 leading-tight">{card.title}</h2>
              <Button
                asChild
                variant="outline"
                className="bg-black text-white border-none rounded-none w-fit px-8 py-6 mb-9"
              >
                <a href={card.buttonLink}>{card.buttonText}</a>
              </Button>
            </div>
          </div>

          {/* Desktop Layout (Text left, Image right) */}
          <div className="hidden md:flex h-full">
            <div className="w-1/2 flex flex-col justify-center px-16">
              <p className="text-sm tracking-widest mb-4">{card.tagline}</p>
              <h2 className="text-5xl font-bold mb-8 leading-tight">{card.title}</h2>
              <Button
                asChild
                variant="outline"
                className="bg-black text-white hover:text-white hover:bg-black/90 border-none rounded-none w-fit px-8 py-6"
              >
                <a href={card.buttonLink}>{card.buttonText}</a>
              </Button>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center p-12">
              <div className="relative w-full h-full max-h-[80vh] rounded-lg overflow-hidden">
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
