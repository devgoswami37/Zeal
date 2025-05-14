import { type NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken } from "@/lib/auth-service"
import { sendPasswordResetEmail } from "@/lib/auth-email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create password reset token
    const token = await createPasswordResetToken(email)

    // Send email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Don't reveal if the email exists or not for security reasons
    return NextResponse.json({ success: true })
  }
}
