import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ["/account"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Auth routes (redirect if already logged in)
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify token
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      return NextResponse.next()
    } catch (error) {
      // Token is invalid
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  if (isAuthRoute && token) {
    try {
      // Verify token
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

      // If token is valid, redirect to account page
      return NextResponse.redirect(new URL("/account", request.url))
    } catch (error) {
      // Token is invalid, continue to auth page
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
}
