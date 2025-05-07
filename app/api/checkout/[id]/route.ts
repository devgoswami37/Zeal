import { type NextRequest, NextResponse } from "next/server"
import { getCheckout } from "@/lib/checkout-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    const checkout = await getCheckout(id)

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      checkout,
    })
  } catch (error) {
    console.error("Checkout retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve checkout" }, { status: 500 })
  }
}
