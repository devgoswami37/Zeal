import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get current user" }, { status: 500 })
  }
}
