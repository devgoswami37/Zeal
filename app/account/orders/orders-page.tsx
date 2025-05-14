"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { ChevronLeft, ShoppingBag } from "lucide-react"

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
  status: string
  friendlyOrderId?: string
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
      setOrdersLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
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
      <div className="mb-8">
        <Link href="/account" className="flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeft size={16} />
          <span>Back to My Account</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {ordersLoading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = formatOrderDate(order.createdAt)
            const formattedDate = `${orderDate}, ${new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            const multipleItems = order.cartItems.length > 1
            const mainProduct = order.cartItems[0]
            const otherProductsCount = order.cartItems.length - 1

            return (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingBag size={16} />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {mainProduct.image ? (
                      <Image
                        src={mainProduct.image || "/placeholder.svg"}
                        alt={mainProduct.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{multipleItems ? "Clothing Basket" : mainProduct.name}</h3>
                    {multipleItems && (
                      <p className="text-sm text-gray-500">
                        +{otherProductsCount} other product{otherProductsCount > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-sm mt-1">Total Shopping</p>
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="flex items-end">
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="inline-block bg-black text-white px-4 py-2 rounded text-sm"
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
  )
}
