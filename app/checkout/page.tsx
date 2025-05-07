import type { Metadata } from "next"
import CheckoutForm from "./checkout-form"

export const metadata: Metadata = {
  title: "Checkout - ZEAL Decor",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutForm />
    </div>
  )
}
