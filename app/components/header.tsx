"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronDown, ChevronRight,
  Search, ShoppingCart, ChevronLeft, User
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collectionsMenuOpen, setCollectionsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [categories, setCategories] = useState([])
  const [mainTags, setMainTags] = useState([])
  const [isMounted, setIsMounted] = useState(false)

  const [promoIndex, setPromoIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const promoMessages = [
    "Free shipping on orders over ₹999!",
    "Get 20% off your first order!",
    "New arrivals just dropped! Don’t miss out!"
  ]

  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"
  const { cart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setPromoIndex((prevIndex) => (prevIndex + 1) % promoMessages.length)
        setFade(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", { next: { revalidate: 60 } })
        const products = await response.json()

        const uniqueCategories = Array.from(
          new Set(products.map((product: any) => product.category))
        ).map((category) => ({
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, "-")
        }))
        setCategories(uniqueCategories)

        const allTags = products.flatMap((product: any) => product.mainTags)
        setMainTags([...new Set(allTags)])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setCollectionsMenuOpen(false)
  }

  const toggleCollectionsMenu = () => {
    setCollectionsMenuOpen(!collectionsMenuOpen)
  }

  return (
    <header className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${isVisible ? "top-0" : "-top-full"}`}>
      {isHomePage && (
        <div className="bg-[#e6cce9] py-2 text-sm text-black text-center overflow-hidden">
          <div className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
            {promoMessages[promoIndex]}
          </div>
        </div>
      )}

      <div className="bg-white w-full relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-12 py-4">
          <button className="md:hidden relative p-2" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="ml-10 md:ml-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixelcut-export%20%2835%29-cHImigrKcDwKWdlhGYPLzdZbOFgBaE.png"
              alt="ZEAL"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className={`hover:text-primary transition-colors ${pathname === "/" ? "text-primary" : ""}`}>Home</Link>

            <div className="relative group">
              <button className="flex items-center hover:text-primary transition-colors">
                Collections
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="hidden group-hover:flex absolute top-full left-1/2 -translate-x-1/2 bg-white p-4 rounded-lg shadow-md flex-col gap-4 min-w-[200px] z-50">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/collections/${category.slug}`} className="hover:text-primary hover:bg-gray-50 p-2 rounded transition-colors">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/products" className={`hover:text-primary transition-colors ${pathname === "/products" ? "text-primary" : ""}`}>Products</Link>
            <Link href="/about" className={`hover:text-primary transition-colors ${pathname === "/about" ? "text-primary" : ""}`}>About</Link>
            <Link href="/contact" className={`hover:text-primary transition-colors ${pathname === "/contact" ? "text-primary" : ""}`}>Contact</Link>
          </nav>

          <div className="flex items-center">
            <Link href={user ? "/account" : "/login"} className="p-2">
              <User className="h-5 w-5" />
            </Link>
            <button className="p-2" onClick={() => router.push("/search")}>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8">
          <button className="absolute top-4 left-4 p-2" onClick={toggleMobileMenu}>
            <X className="h-6 w-6" />
          </button>

          <Link href="/" className="text-2xl" onClick={toggleMobileMenu}>Home</Link>
          <button className="text-2xl flex items-center" onClick={toggleCollectionsMenu}>
            Collections <ChevronRight className="ml-1 h-5 w-5" />
          </button>
          <Link href="/products" className="text-2xl" onClick={toggleMobileMenu}>Products</Link>
          <Link href="/about" className="text-2xl" onClick={toggleMobileMenu}>About</Link>
          <Link href="/contact" className="text-2xl" onClick={toggleMobileMenu}>Contact</Link>
          <Link href={user ? "/account" : "/login"} className="text-2xl" onClick={toggleMobileMenu}>My Account</Link>
        </div>
      )}

      {/* Collections Menu (Mobile) */}
      {collectionsMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8">
          <button className="absolute top-4 left-4 p-2 flex items-center" onClick={() => setCollectionsMenuOpen(false)}>
            <ChevronLeft className="h-6 w-6 mr-1" />
            Back
          </button>
          {categories.map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="text-2xl" onClick={() => {
              setCollectionsMenuOpen(false)
              setMobileMenuOpen(false)
            }}>
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
