"use client"

import type React from "react"

import { cleanupExpiredCart } from "@/lib/cart-utils"
import { useEffect } from "react"

function CartCleanup() {
  useEffect(() => {
    // Clean up expired cart data when the app loads
    cleanupExpiredCart()
  }, [])

  return null
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartCleanup />
      {children}
    </>
  )
}