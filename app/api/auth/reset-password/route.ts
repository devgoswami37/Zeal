import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token, password } = body

    // Validate input
    if (!email || !token || !password) {
      return NextResponse.json({ error: "Email, token, and password are required" }, { status: 400 })
    }

    // Reset password
    await resetPassword(email, token, password)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 400 })
  }
}
