import { type NextRequest, NextResponse } from "next/server"
import { getCheckout, markCheckoutAsPaid } from "@/lib/checkout-service"
import { verifyRazorpayPayment } from "@/lib/razorpay-service"

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    // Check if all required parameters are provided
    if (!checkoutId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Get the checkout from the database
    const checkout = await getCheckout(checkoutId)

    // Check if checkout exists
    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    // Verify the payment signature
    const isValid = verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 })
    }

    // Mark checkout as paid with Razorpay payment details
    const updatedCheckout = await markCheckoutAsPaid(
      checkoutId,
      "razorpay",  // Payment method
      razorpayPaymentId,
      razorpayOrderId
    )

    // Update the checkout document with Razorpay order details
    await checkout.updateOne({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })

    // Respond with the updated checkout
    return NextResponse.json({
      success: true,
      checkout: updatedCheckout,
    })
  } catch (error) {
    console.error("Razorpay payment verification error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}
