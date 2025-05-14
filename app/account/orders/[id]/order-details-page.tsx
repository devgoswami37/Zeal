"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { ChevronLeft, ShoppingBag, Package, Truck, CheckCircle } from "lucide-react"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  color: string
  size: string
  image: string
}

interface Order {
  _id: string
  createdAt: string
  completedAt?: string
  cartItems: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  status: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  pinCode: string
  country: string
  paymentMethod?: string
  friendlyOrderId?: string
}

export default function OrderDetailsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && params.id) {
      fetchOrderDetails(params.id as string)
    }
  }, [user, params.id])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      if (data.success) {
        setOrder(data.order)
      } else {
        router.push("/account/orders")
      }
      setOrderLoading(false)
    } catch (error) {
      console.error("Error fetching order details:", error)
      setOrderLoading(false)
    }
  }

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getOrderStatus = () => {
    if (!order) return { step: 0, label: "" }

    switch (order.status) {
      case "paid":
        return { step: 1, label: "Order Placed" }
      case "processing":
        return { step: 2, label: "Processing" }
      case "shipped":
        return { step: 3, label: "Shipped" }
      case "completed":
        return { step: 4, label: "Delivered" }
      default:
        return { step: 1, label: "Order Placed" }
    }
  }

  if (loading || orderLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  if (!user || !order) {
    return null
  }

  const orderStatus = getOrderStatus()

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mb-8">
        <Link href="/account/orders" className="flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeft size={16} />
          <span>Back to My Orders</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-500 mt-1">
            Order {order.friendlyOrderId || order._id} • Placed on {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>
        <div className="relative">
          <div className="flex justify-between mb-2">
            <div className="text-center flex-1">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${orderStatus.step >= 1 ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                <ShoppingBag size={20} />
              </div>
              <p className="text-sm mt-1">Order Placed</p>
            </div>
            <div className="text-center flex-1">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${orderStatus.step >= 2 ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                <Package size={20} />
              </div>
              <p className="text-sm mt-1">Processing</p>
            </div>
            <div className="text-center flex-1">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${orderStatus.step >= 3 ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                <Truck size={20} />
              </div>
              <p className="text-sm mt-1">Shipped</p>
            </div>
            <div className="text-center flex-1">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${orderStatus.step >= 4 ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                <CheckCircle size={20} />
              </div>
              <p className="text-sm mt-1">Delivered</p>
            </div>
          </div>
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div className="h-full bg-green-500" style={{ width: `${(orderStatus.step - 1) * 33.33}%` }}></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Items in Your Order</h2>
        <div className="border rounded-lg overflow-hidden">
          {order.cartItems.map((item, index) => (
            <div key={index} className={`flex p-4 ${index < order.cartItems.length - 1 ? "border-b" : ""}`}>
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
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
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  {item.color && <span className="mr-3">Color: {item.color}</span>}
                  {item.size && <span>Size: {item.size}</span>}
                </div>
                <div className="flex justify-between mt-2">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">
              {order.firstName} {order.lastName}
            </p>
            <p>{order.address}</p>
            {order.apartment && <p>{order.apartment}</p>}
            <p>
              {order.city}, {order.state} {order.pinCode}
            </p>
            <p>{order.country}</p>
            <p className="mt-2">{order.phone}</p>
            <p>{order.email}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="border-t my-2 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Payment Method: {order.paymentMethod || "Online Payment"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
