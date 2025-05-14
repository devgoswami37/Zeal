import { type NextRequest, NextResponse } from "next/server"
import { createUser, createToken, setAuthCookie } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create user
    const user = await createUser({ firstName, lastName, email, password })

    // Create token
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
    })

    // Set cookie and return response
    const response = NextResponse.json({ success: true, user })
    return setAuthCookie(response, token)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register user" }, { status: 400 })
  }
}
