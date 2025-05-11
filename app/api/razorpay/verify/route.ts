import { type NextRequest, NextResponse } from "next/server"
import { getCheckout, markCheckoutAsPaid, markCheckoutAsFailed } from "@/lib/checkout-service"
import { verifyRazorpayPayment } from "@/lib/razorpay-service"

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    // Validate request data
    if (!checkoutId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Fetch checkout document
    const checkout = await getCheckout(checkoutId)
    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    // Verify payment signature
    const isValid = verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (isValid) {
      // Mark as paid
      const updatedCheckout = await markCheckoutAsPaid(
        checkoutId,
        "razorpay",
        razorpayPaymentId,
        razorpayOrderId
      )

      // Optionally store signature
      await checkout.updateOne({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        checkout: updatedCheckout,
      })
    } else {
      // Signature invalid — mark as failed
      await markCheckoutAsFailed(checkoutId, "Payment signature verification failed")

      return NextResponse.json({
        success: false,
        error: "Invalid payment signature",
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Razorpay payment verification error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to verify payment",
    }, { status: 500 })
  }
}
