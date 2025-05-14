"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

interface Order {
  _id: string
  createdAt: string
  cartItems: Array<{
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  friendlyOrderId?: string
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchRecentOrders()
    }
  }, [user])

  const fetchRecentOrders = async () => {
    try {
      if (!user || !user.email) {
        console.error("No user email available")
        setOrdersLoading(false)
        return
      }

      console.log("Fetching orders for email:", user.email)

      // Try the POST endpoint first
      const response = await fetch("/api/orders/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data.success) {
        setRecentOrders(data.orders)
      } else {
        console.error("API returned error:", data.message)
      }

      setOrdersLoading(false)
    } catch (error) {
      console.error("Error fetching recent orders:", error)
      setOrdersLoading(false)
    }
  }

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <button onClick={logout} className="text-gray-600 hover:text-gray-900 mt-2 md:mt-0">
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order History</h2>
            <Link href="/account/orders" className="text-sm text-gray-600 hover:text-gray-900 underline">
              View all orders
            </Link>
          </div>

          {ordersLoading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const orderDate = formatOrderDate(order.createdAt)
                const formattedDate = `${orderDate}, ${new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                const multipleItems = order.cartItems.length > 1
                const mainProduct = order.cartItems[0]
                const otherProductsCount = order.cartItems.length - 1

                return (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                      <ShoppingBag size={16} />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {mainProduct && mainProduct.image ? (
                          <Image
                            src={mainProduct.image || "/placeholder.svg"}
                            alt={mainProduct.name || "Product"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingBag size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">
                          {multipleItems ? "Clothing Basket" : mainProduct ? mainProduct.name : "Product"}
                        </h3>
                        {multipleItems && (
                          <p className="text-sm text-gray-500">
                            +{otherProductsCount} other product{otherProductsCount > 1 ? "s" : ""}
                          </p>
                        )}
                        <p className="text-sm mt-1">Total Shopping</p>
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                      </div>
                      <div>
                        <Link
                          href={`/account/orders/${order._id}`}
                          className="inline-block mt-2 bg-black text-white px-4 py-2 rounded text-sm"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>
          <p className="mb-1">
            {user.firstName} {user.lastName}
          </p>
          <p className="mb-4">{user.email}</p>

          <p className="mb-1">United States</p>
          <Link href="/account/addresses" className="text-gray-600 hover:text-gray-900 underline">
            View Addresses (1)
          </Link>
        </div>
      </div>
    </div>
  )
}
