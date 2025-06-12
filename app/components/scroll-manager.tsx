"use client"

import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

export default function ScrollManager() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Wait for DOM to be ready
    const initScrollAnimations = () => {
      const footer = document.querySelector("footer")
      const contentSection = document.querySelector(".content-section")

      if (footer && contentSection) {
        console.log("Elements found, setting up animations")

        // Set initial positions
        gsap.set(footer, { y: "100%" })
        gsap.set(contentSection, { y: "0%" })

        // Create the parallax animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            markers: true, // Enable markers for debugging
            onUpdate: (self) => {
              console.log("Scroll progress:", self.progress)
            },
            onToggle: (self) => {
              console.log("Animation toggled:", self.isActive)
            },
          },
        })

        // Animate content section up faster
        tl.to(
          contentSection,
          {
            y: "-50%",
            ease: "none",
          },
          0,
        )

        // Animate footer up slower
        tl.to(
          footer,
          {
            y: "0%",
            ease: "none",
          },
          0,
        )

        console.log("ScrollTrigger animation created")
      } else {
        console.log("Elements not found:", { footer, contentSection })
      }
    }

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initScrollAnimations, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return null
}
