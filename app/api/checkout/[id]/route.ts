import { type NextRequest, NextResponse } from "next/server"
import { getCheckout } from "@/lib/checkout-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    console.log(`Fetching checkout with ID: ${id}`)
    const checkout = await getCheckout(id)

    if (!checkout) {
      console.log(`Checkout not found for ID: ${id}`)
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    console.log(`Checkout found for ID: ${id}, status: ${checkout.status}`)
    return NextResponse.json({ success: true, checkout })
  } catch (error) {
    console.error("Error fetching checkout:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch checkout" }, { status: 500 })
  }
}
