import { type NextRequest, NextResponse } from "next/server"
import { calculateShippingCost } from "@/lib/checkout-service"

export async function POST(request: NextRequest) {
  try {
    const { pinCode } = await request.json()

    if (!pinCode) {
      return NextResponse.json({ success: false, error: "PIN code is required" }, { status: 400 })
    }

    const shippingCost = await calculateShippingCost(pinCode)

    return NextResponse.json({
      success: true,
      shippingCost,
    })
  } catch (error) {
    console.error("Shipping calculation error:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate shipping cost" }, { status: 500 })
  }
}
