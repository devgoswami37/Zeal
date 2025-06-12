"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

export function useParallaxFooter(contentRef: React.RefObject<HTMLElement>, footerRef: React.RefObject<HTMLElement>) {
  const isSetUp = useRef(false)

  useEffect(() => {
    if (!contentRef.current || !footerRef.current || isSetUp.current) return

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Create the parallax effect between content and footer
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    })

    // Content moves faster than the footer
    timeline.to(
      contentRef.current,
      {
        y: "-20%",
        ease: "none",
      },
      0,
    )

    // Footer moves slower
    timeline.to(
      footerRef.current,
      {
        y: "0%",
        ease: "none",
      },
      0,
    )

    isSetUp.current = true

    return () => {
      // Clean up
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill()
      }
      timeline.kill()
    }
  }, [contentRef, footerRef])
}
