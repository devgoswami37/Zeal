"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<any>(null)
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!scrollRef.current) return

    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScrollModule = await import("locomotive-scroll")
        const LocomotiveScroll = LocomotiveScrollModule.default

        locomotiveScrollRef.current = new LocomotiveScroll({
          el: scrollRef.current as HTMLElement,
          smooth: true,
          smoothMobile: true,
          multiplier: 1,
          class: "is-revealed",
          lerp: 0.08,
          smartphone: {
            smooth: true,
          },
          tablet: {
            smooth: true,
            breakpoint: 768,
          },
        })

        // Update ScrollTrigger when locomotive scroll updates
        locomotiveScrollRef.current.on("scroll", ScrollTrigger.update)

        // Set up ScrollTrigger to work with Locomotive Scroll
        ScrollTrigger.scrollerProxy(scrollRef.current, {
          scrollTop(value) {
            return arguments.length
              ? locomotiveScrollRef.current.scrollTo(value, 0, 0)
              : locomotiveScrollRef.current.scroll.instance.scroll.y
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            }
          },
          pinType: scrollRef.current?.style.transform ? "transform" : "fixed",
        })

        // Refresh ScrollTrigger after locomotive scroll is ready
        setTimeout(() => {
          if (locomotiveScrollRef.current) {
            locomotiveScrollRef.current.update()
            ScrollTrigger.refresh()
            setIsReady(true)
            console.log("Locomotive Scroll initialized and ScrollTrigger refreshed")
          }
        }, 1000)
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error)
        setIsReady(true) // Set ready even if locomotive fails
      }
    }

    initLocomotiveScroll()

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy()
        locomotiveScrollRef.current = null
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    if (locomotiveScrollRef.current && isReady) {
      setTimeout(() => {
        locomotiveScrollRef.current.scrollTo(0, 0)
        locomotiveScrollRef.current.update()
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [pathname, isReady])

  return (
    <div ref={scrollRef} data-scroll-container className="relative">
      {children}
    </div>
  )
}
