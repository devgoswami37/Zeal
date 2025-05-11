import { type NextRequest, NextResponse } from "next/server"
import { markCheckoutAsFailed } from "@/lib/checkout-service"

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, reason } = await request.json()

    if (!checkoutId) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    const checkout = await markCheckoutAsFailed(checkoutId, reason || "Payment failed")

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Checkout marked as failed",
      checkout,
    })
  } catch (error) {
    console.error("Payment failure handling error:", error)
    return NextResponse.json({ success: false, error: "Failed to process payment failure" }, { status: 500 })
  }
}
