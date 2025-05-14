import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Checkout from "@/models/Checkout"
import { jwtVerify } from "jose"
import mongoose from "mongoose"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get the token from the cookies
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=")
        return [name, value]
      }),
    )

    const token = cookies.auth_token

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token found" }, { status: 401 })
    }

    // Verify the token
    let payload
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      const { payload: verifiedPayload } = await jwtVerify(token, secret)
      payload = verifiedPayload
    } catch (error) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    // Extract user email from the token
    const userEmail = payload.email as string

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized: No email in token" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID format" }, { status: 400 })
    }

    // Fetch the order
    const order = await Checkout.findOne({
      _id: id,
      email: userEmail,
      status: { $in: ["paid", "completed"] },
    }).lean()

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
