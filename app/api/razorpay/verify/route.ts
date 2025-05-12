import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getCheckout, markCheckoutAsPaid, markCheckoutAsFailed } from "@/lib/checkout-service"

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    if (!checkoutId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Get the checkout from the database
    const checkout = await getCheckout(checkoutId)

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    // Verify the payment signature
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex")

    const isValid = expectedSignature === razorpaySignature

    if (!isValid) {
      // Mark the checkout as failed
      await markCheckoutAsFailed(checkoutId, "Invalid payment signature")

      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 })
    }

    // Mark the checkout as paid
    const updatedCheckout = await markCheckoutAsPaid(checkoutId, "razorpay", razorpayPaymentId, razorpayOrderId)

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      checkout: updatedCheckout,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
