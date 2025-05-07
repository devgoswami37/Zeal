"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CheckoutHeaderProps {
  showOrderSummary: boolean
  setShowOrderSummary: (show: boolean) => void
  total: number
}

export function CheckoutHeader({
  showOrderSummary,
  setShowOrderSummary,
  total,
}: CheckoutHeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="border-b pb-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          ZEAL Decor
        </Link>

        {/* Mobile Summary */}
        <div className="md:hidden flex flex-col items-end text-right">
          <button
            type="button"
            className="flex items-center text-blue-600"
            onClick={() => setShowOrderSummary(!showOrderSummary)}
          >
            <span className="mr-2">Show order summary</span>
            <svg
              className={`w-4 h-4 transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Render `total` only after mount to prevent hydration mismatch */}
          {mounted && (
            <span className="text-xl font-bold mt-1">₹{total.toFixed(2)}</span>
          )}
        </div>

        {/* Desktop Summary */}
        <div className="hidden md:flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          <span className="text-lg font-medium">Checkout</span>
        </div>
      </div>
    </header>
  )
}
