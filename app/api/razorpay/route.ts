import { type NextRequest, NextResponse } from "next/server"
import { getCheckout, markCheckoutAsProcessing } from "@/lib/checkout-service"
import Razorpay from "razorpay"

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

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Create a Razorpay order
    const options = {
      amount: Math.round(checkout.total * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${checkoutId}`,
      payment_capture: 1, // Auto-capture payment
    }

    const order = await razorpay.orders.create(options)

    // Update the checkout with the Razorpay order ID
    await markCheckoutAsProcessing(checkoutId, order.id)

    // Return the order details to the client
    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Your Store",
      description: `Order #${checkoutId}`,
      image: "/logo.png", // Replace with your logo URL
      order: order,
      prefill: {
        name: `${checkout.firstName} ${checkout.lastName}`,
        email: checkout.email,
        contact: checkout.phone,
      },
      notes: {
        checkoutId: checkoutId,
        address: `${checkout.address}, ${checkout.city}, ${checkout.state}, ${checkout.pinCode}`,
      },
      theme: {
        color: "#3B82F6", // Blue color
      },
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create Razorpay order" }, { status: 500 })
  }
}
