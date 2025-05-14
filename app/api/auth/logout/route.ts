import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  return clearAuthCookie(response)
}
