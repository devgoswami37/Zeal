"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function SaleTimer() {
  const [hours, setHours] = useState(12)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // Check if we have a stored end time
    const storedEndTime = localStorage.getItem("saleEndTime")
    let endTime: number

    if (storedEndTime) {
      // Use the stored end time
      endTime = Number.parseInt(storedEndTime, 10)
    } else {
      // Create a new end time 12 hours from now
      endTime = Date.now() + 12 * 60 * 60 * 1000
      localStorage.setItem("saleEndTime", endTime.toString())
    }

    // Update the timer every second
    const timer = setInterval(() => {
      const now = Date.now()
      const distance = endTime - now

      // If the countdown is over
      if (distance < 0) {
        clearInterval(timer)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
        // Reset the timer for demo purposes
        localStorage.removeItem("saleEndTime")
        return
      }

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
    }, 1000)

    // Clean up the interval on unmount
    return () => clearInterval(timer)
  }, [])

  // Format numbers to always have two digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0")
  }

  return (
    <section className="relative h-[75vh] md:h-[120vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://chantilly.myshopify.com/cdn/shop/files/sunsets-coll_1__CROP.jpg?v=1699884173&width=2000"
          alt="Sale background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <p className="uppercase tracking-widest text-sm md:text-base mb-4">Limited time only</p>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-4">Sale now on!</h2>

        <p className="text-lg md:text-xl mb-10 max-w-xl">Our best-ever offers won't be around forever.</p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-light">{formatNumber(hours)}</span>
            <span className="text-xs md:text-sm uppercase tracking-wider mt-1">Hour</span>
          </div>

          <span className="text-3xl md:text-5xl font-light">:</span>

          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-light">{formatNumber(minutes)}</span>
            <span className="text-xs md:text-sm uppercase tracking-wider mt-1">Min</span>
          </div>

          <span className="text-3xl md:text-5xl font-light">:</span>

          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-light">{formatNumber(seconds)}</span>
            <span className="text-xs md:text-sm uppercase tracking-wider mt-1">Sec</span>
          </div>
        </div>

        {/* Shop Now Button */}
        <Link
          href="/products"
          className="bg-white text-black px-8 py-3 uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors duration-300"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
