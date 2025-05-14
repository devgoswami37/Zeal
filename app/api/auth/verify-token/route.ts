import { type NextRequest, NextResponse } from "next/server"
import { verifyPasswordResetToken } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = body

    // Validate input
    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 })
    }

    // Verify token
    await verifyPasswordResetToken(email, token)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid or expired token" }, { status: 400 })
  }
}
