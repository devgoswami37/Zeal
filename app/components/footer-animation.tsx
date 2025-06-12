"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import ScrollTrigger from "gsap/ScrollTrigger"

export default function FooterAnimation() {
    const pathname = usePathname() 
  useEffect(() => {
    if (typeof window === "undefined") return

    gsap.registerPlugin(ScrollTrigger)

    const initAnimation = () => {
      console.log("Initializing footer animation")

      const footer = document.getElementById("site-footer")
      const main = document.getElementById("site-main")

      if (!footer || !main) {
        console.error("Footer or main element not found")
        return
      }

      const footerHeight = footer.offsetHeight
      console.log(`Footer height: ${footerHeight}px`)

      // Position footer absolutely below main content
      gsap.set(footer, {
        y: 0,
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
      })

      // Create GSAP timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.5,
          markers: false,
          onUpdate: (self) => {
            // Optional: log progress for debugging
            // console.log(`Progress: ${self.progress.toFixed(2)}`)
          },
        },
      })

      tl.to(main, {
        y: `-${footerHeight * 0.5}px`,
        ease: "none",
      })

      // Force ScrollTrigger to refresh measurements after setup to fix reload issues
      setTimeout(() => {
        ScrollTrigger.refresh()
        console.log("ScrollTrigger refreshed after initialization")
      }, 100)
    }

    // Delay init to ensure DOM and styles are ready
    const timer = setTimeout(initAnimation, 500)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [pathname])

  return null
}
