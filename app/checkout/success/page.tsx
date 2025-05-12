"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const checkoutId = searchParams.get("id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!checkoutId) {
        console.error("No checkout ID provided")
        setError("No order ID provided")
        setLoading(false)
        return
      }

      console.log("Fetching order details for ID:", checkoutId)

      try {
        const response = await fetch(`/api/checkout/${checkoutId}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API responded with status: ${response.status}`, errorText)
          setError(`Failed to fetch order details: ${response.status}`)
          setLoading(false)
          return
        }

        const data = await response.json()
        console.log("Order details response:", data)

        if (data.success) {
          setOrderDetails(data.checkout)
        } else {
          console.error("API returned error:", data.error)
          setError(data.error || "Failed to fetch order details")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("An error occurred while fetching order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [checkoutId])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Thank you for your order!</h1>
            <p className="text-gray-600 mt-2">Your order has been placed and is being processed.</p>
            {orderDetails?.paymentId && (
              <p className="text-sm text-gray-500 mt-2">Payment ID: {orderDetails.paymentId}</p>
            )}
            {checkoutId && <p className="text-sm text-gray-500 mt-1">Order ID: {checkoutId}</p>}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading order details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <p className="mt-4 text-gray-600">
                Don't worry, your order has been processed successfully. You can contact customer support for more
                details.
              </p>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orderDetails.cartItems?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 mr-3">
                                {item.image && (
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-10 w-10 object-cover rounded"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.color && `Color: ${item.color}`}
                                  {item.color && item.size && ", "}
                                  {item.size && `Size: ${item.size}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium" colSpan={2}>
                          Subtotal
                        </td>
                        <td className="px-4 py-3 text-right font-medium">₹{orderDetails.subtotal?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium" colSpan={2}>
                          Shipping
                        </td>
                        <td className="px-4 py-3 text-right font-medium">₹{orderDetails.shippingCost?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-base font-bold" colSpan={2}>
                          Total
                        </td>
                        <td className="px-4 py-3 text-right font-bold">₹{orderDetails.total?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
                  <div className="border rounded-lg p-4">
                    <p>
                      {orderDetails.firstName} {orderDetails.lastName}
                    </p>
                    <p>{orderDetails.address}</p>
                    {orderDetails.apartment && <p>{orderDetails.apartment}</p>}
                    <p>
                      {orderDetails.city}, {orderDetails.state} {orderDetails.pinCode}
                    </p>
                    <p>{orderDetails.country}</p>
                    <p className="mt-2">Email: {orderDetails.email}</p>
                    <p>Phone: {orderDetails.phone}</p>
                  </div>
                </div>

                {!orderDetails.billingAddressSameAsShipping && orderDetails.billingAddress && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Billing Information</h2>
                    <div className="border rounded-lg p-4">
                      <p>
                        {orderDetails.billingAddress.firstName} {orderDetails.billingAddress.lastName}
                      </p>
                      <p>{orderDetails.billingAddress.address}</p>
                      {orderDetails.billingAddress.apartment && <p>{orderDetails.billingAddress.apartment}</p>}
                      <p>
                        {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state}{" "}
                        {orderDetails.billingAddress.pinCode}
                      </p>
                      <p>{orderDetails.billingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
                <div className="border rounded-lg p-4">
                  <p>
                    Status: <span className="font-medium text-green-600">Paid</span>
                  </p>
                  <p>Payment Method: Razorpay</p>
                  {orderDetails.paymentId && <p>Payment ID: {orderDetails.paymentId}</p>}
                  {orderDetails.completedAt && (
                    <p>Payment Date: {new Date(orderDetails.completedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Order details not found.</p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
