"use client"

import type React from "react"
import { Types } from "mongoose";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { CheckoutHeader } from "./checkout-header"
import { ContactSection } from "./contact-section"
import { DeliverySection } from "./delivery-section"
import { PaymentSection } from "./payment-section"
import { OrderSummary } from "./order-summary"
import { BillingSection } from "./billing-section"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Script from "next/script"

// Declare Razorpay as a global variable
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutForm() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    saveInformation: false,
    billingAddressSameAsShipping: true,
    billingAddress: {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
    marketingConsent: false,
  })
  const [shippingCost, setShippingCost] = useState(0)
  const [addressComplete, setAddressComplete] = useState(false)

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.items.length === 0) {
      router.push("/cart")
    }

    // Load saved information from localStorage if available
    const savedInfo = localStorage.getItem("checkoutInfo")
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo)
        setFormData((prevData) => ({
          ...prevData,
          ...parsedInfo,
        }))
      } catch (error) {
        console.error("Error parsing saved checkout info:", error)
      }
    }
  }, [cart.items.length, router])

  // Calculate shipping cost when PIN code is entered
  useEffect(() => {
    const calculateShipping = async () => {
      if (formData.pinCode && formData.pinCode.length === 6) {
        try {
          const response = await fetch("/api/checkout/shipping", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pinCode: formData.pinCode }),
          })

          const data = await response.json()

          if (data.success) {
            setShippingCost(data.shippingCost)
          }
        } catch (error) {
          console.error("Error calculating shipping:", error)
        }
      }
    }

    calculateShipping()
  }, [formData.pinCode])

  // Check if address is complete to enable shipping methods
  useEffect(() => {
    const { address, city, state, pinCode } = formData
    setAddressComplete(Boolean(address && city && state && pinCode))
  }, [formData.address, formData.city, formData.state, formData.pinCode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const isCheckbox = type === "checkbox"
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: inputValue,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue,
      }))
    }
  }

  const saveCheckoutInfo = () => {
    if (formData.saveInformation) {
      const infoToSave = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country,
      }
      localStorage.setItem("checkoutInfo", JSON.stringify(infoToSave))
    }
  }

  const handleRazorpayPayment = async (checkoutId: string) => {
    try {
      // Create a Razorpay order
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkoutId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create Razorpay order")
      }

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        image: data.image,
        order_id: data.order.id,
        handler: async (response: any) => {
          try {
            // Verify the payment
            const verifyResponse = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                checkoutId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Clear the cart after successful payment
              clearCart()

              // Show success message
              toast({
                title: "Payment successful!",
                description: "Your order has been placed and is being processed.",
              })

              // Redirect to success page
              router.push(`/checkout/success?id=${checkoutId}`)
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment verification failed",
              description: "There was a problem verifying your payment. Please contact support.",
              variant: "destructive",
            })
          }
        },
        prefill: data.prefill,
        notes: data.notes,
        theme: data.theme,
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment cancelled",
              description: "Your payment was cancelled. You can try again when you're ready.",
            })
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Razorpay payment error:", error)
      toast({
        title: "Payment initialization failed",
        description: "There was a problem setting up the payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Save checkout info if requested
      saveCheckoutInfo()

      // Prepare cart items for checkout
      const cartItems = cart.items.map((item) => ({
        productId: new Types.ObjectId(item.product.id),
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.image || item.product.images?.[0] || "/placeholder.svg",
      }))

      // Create checkout in database
      const checkoutData = {
        ...formData,
        cartItems,
        subtotal: cart.subtotal,
        shippingCost,
        total: cart.subtotal + shippingCost,
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      if (data.success) {
        setCheckoutId(data.checkoutId)

        // Initiate Razorpay payment
        await handleRazorpayPayment(data.checkoutId)
      } else {
        throw new Error(data.error || "Failed to create checkout")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Load Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayLoaded(true)} />

      <div className="container mx-auto px-4 py-8">
        <CheckoutHeader
          showOrderSummary={showOrderSummary}
          setShowOrderSummary={setShowOrderSummary}
          total={cart.subtotal + shippingCost}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <ContactSection
                email={formData.email}
                phone={formData.phone}
                marketingConsent={formData.marketingConsent}
                onChange={handleInputChange}
              />

              <DeliverySection formData={formData} onChange={handleInputChange} />

              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
                {addressComplete ? (
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Standard Shipping</p>
                    <p className="font-medium">₹{shippingCost.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Estimated delivery: 3-5 business days</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      Enter your shipping address to view available shipping methods.
                    </p>
                  </div>
                )}
              </div>

              <PaymentSection />

              <BillingSection formData={formData} onChange={handleInputChange} />

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || !razorpayLoaded}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay now"
                  )}
                </Button>
                {!razorpayLoaded && (
                  <p className="text-sm text-center mt-2 text-gray-500">Loading payment gateway...</p>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  By completing your purchase, you agree to our{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  , and{" "}
                  <a href="/refund" className="text-blue-600 hover:underline">
                    Refund Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
                cartItems={cart.items}
                subtotal={cart.subtotal}
                shippingCost={shippingCost}
                total={cart.subtotal + shippingCost}
                showMobile={showOrderSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
