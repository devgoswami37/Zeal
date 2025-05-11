import { type NextRequest, NextResponse } from "next/server"
import { getCheckout } from "@/lib/checkout-service"
import { sendOrderStatusEmail } from "@/lib/email-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const checkoutId = searchParams.get("checkoutId")
    const type = searchParams.get("type") || "success"

    if (!checkoutId) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    const checkout = await getCheckout(checkoutId)

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    // Temporarily set the status for email testing
    const originalStatus = checkout.status
    checkout.status = type === "success" ? "paid" : "failed"

    const emailSent = await sendOrderStatusEmail(checkout)

    // Restore original status
    checkout.status = originalStatus
    await checkout.save()

    return NextResponse.json({
      success: emailSent,
      message: emailSent ? "Email sent successfully" : "Failed to send email",
      emailType: type === "success" ? "Order Confirmation" : "Payment Failed",
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({ success: false, error: "Failed to send test email" }, { status: 500 })
  }
}
