"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function Footer() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Video autoplay prevented:", err))
      videoRef.current.muted = true
      videoRef.current.loop = true
    }
  }, [])

  return (
    <footer id="site-footer" className="bg-black text-[#f0e6d6] overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40">
        <video
          ref={videoRef}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 h-auto w-[60%] md:w-[40%] object-cover"
          playsInline
          muted
          loop
        >
          <source src="https://www.exoape.com/video/video-6.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Footer content */}
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        {/* Header section */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-6xl md:text-8xl font-light text-[#f0e6d6] mb-6">Our Story</h2>
          <p className="text-xl md:text-2xl text-[#a09a8f] max-w-xl">
            The story behind our brand is one of exploration, creativity and curiosity.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#333] mb-16"></div>

        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 - Address */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-[#a09a8f] mb-1">Willem II Singel 8</p>
            <p className="text-[#a09a8f] mb-1">6041 HS, Roermond</p>
            <p className="text-[#a09a8f]">The Netherlands</p>
          </div>

          {/* Column 2 - Company */}
          <div>
            <ul className="space-y-4">
              <li>
                <Link href="/work" className="text-[#f0e6d6] hover:text-white transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-[#f0e6d6] hover:text-white transition-colors">
                  Studio
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-[#f0e6d6] hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#f0e6d6] hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Social */}
          <div>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0e6d6] hover:text-white transition-colors"
                >
                  Behance
                </a>
              </li>
              <li>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0e6d6] hover:text-white transition-colors"
                >
                  Dribbble
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0e6d6] hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0e6d6] hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
