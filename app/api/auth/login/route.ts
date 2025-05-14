import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, setAuthCookie } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const { user, token } = await authenticateUser(email, password)

    // Set cookie and return response
    const response = NextResponse.json({ success: true, user })
    return setAuthCookie(response, token)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to authenticate user" }, { status: 401 })
  }
}
