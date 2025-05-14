import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Checkout from "@/models/Checkout"
import { jwtVerify } from "jose"

export async function GET(req: Request) {
  try {
    // Get the token from the cookies
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=")
        return [name, value]
      }),
    )

    const token = cookies.auth_token

    console.log("Auth token from cookies:", token ? "Found" : "Not found")

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token found" }, { status: 401 })
    }

    // Verify the token
    let payload
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      const { payload: verifiedPayload } = await jwtVerify(token, secret)
      payload = verifiedPayload
      console.log("Token verified, payload:", payload)
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    // Extract user email from the token
    const userEmail = payload.email as string
    console.log("User email from token:", userEmail)

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized: No email in token" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()
    console.log("Database connected successfully")

    // Fetch recent orders
    const orders = await Checkout.find({
      email: userEmail,
      status: { $in: ["paid", "completed"] },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    console.log(`Found ${orders.length} orders for email: ${userEmail}`)

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch recent orders",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
