import { type NextRequest, NextResponse } from "next/server"
import { getCheckout, markCheckoutAsProcessing } from "@/lib/checkout-service"
import { createRazorpayOrder } from "@/lib/razorpay-service"

export async function POST(request: NextRequest) {
  try {
    const { checkoutId } = await request.json()

    if (!checkoutId) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    // Get the checkout from the database
    const checkout = await getCheckout(checkoutId)

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    // Create a Razorpay order
    const razorpayOrder = await createRazorpayOrder(checkout)

    // Update the checkout with the Razorpay order ID
    await markCheckoutAsProcessing(checkoutId, razorpayOrder.id)

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "ZEAL Decor",
      description: "Purchase from ZEAL Decor",
      image: "https://res.cloudinary.com/dqhp9pxpy/image/upload/v1746627843/ZEAL_logo.png", // Your company logo
      prefill: {
        name: `${checkout.firstName} ${checkout.lastName}`,
        email: checkout.email,
        contact: checkout.phone,
      },
      notes: {
        address: `${checkout.address}, ${checkout.city}, ${checkout.state}, ${checkout.pinCode}`,
      },
      theme: {
        color: "#3399cc",
      },
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create Razorpay order" }, { status: 500 })
  }
}
