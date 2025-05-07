import { type NextRequest, NextResponse } from "next/server"
import { createCheckout, updateCheckout, calculateShippingCost } from "@/lib/checkout-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Calculate shipping cost based on PIN code
    if (data.pinCode) {
      const shippingCost = await calculateShippingCost(data.pinCode)
      data.shippingCost = shippingCost
      data.total = data.subtotal + shippingCost
    }

    // Add IP address and user agent for analytics
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    data.ipAddress = ip
    data.userAgent = userAgent

    const checkout = await createCheckout(data)

    return NextResponse.json({
      success: true,
      checkoutId: checkout._id,
      checkout,
    })
  } catch (error) {
    console.error("Checkout creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create checkout" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ success: false, error: "Checkout ID is required" }, { status: 400 })
    }

    // Calculate shipping cost if PIN code is updated
    if (updateData.pinCode) {
      const shippingCost = await calculateShippingCost(updateData.pinCode)
      updateData.shippingCost = shippingCost
      if (updateData.subtotal) {
        updateData.total = updateData.subtotal + shippingCost
      }
    }

    const checkout = await updateCheckout(id, updateData)

    if (!checkout) {
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      checkout,
    })
  } catch (error) {
    console.error("Checkout update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update checkout" }, { status: 500 })
  }
}
