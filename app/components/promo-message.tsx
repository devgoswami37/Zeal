"use client"

import { usePathname } from "next/navigation"

export default function PromoMessage() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Only show on homepage
  if (!isHomePage) return null

  return (
    <div className="bg-primary text-primary-foreground text-center py-2 text-sm z-50">
      Get 20% off your first order! Use code WELCOME20 at checkout.
    </div>
  )
}
