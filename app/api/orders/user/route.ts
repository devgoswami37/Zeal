import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Checkout from "@/models/Checkout"

export async function POST(req: Request) {
  try {
    // Get the email from the request body
    const { email } = await req.json()

    console.log("Received email:", email)

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Connect to the database
    await connectToDatabase()
    console.log("Database connected successfully")

    // Fetch recent orders
    const orders = await Checkout.find({
      email: email,
      status: { $in: ["paid", "completed"] },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    console.log(`Found ${orders.length} orders for email: ${email}`)

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
