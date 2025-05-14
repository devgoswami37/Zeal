import { SignJWT, jwtVerify } from "jose"
import type { NextRequest, NextResponse } from "next/server"
import User from "@/models/User"
import { connectToDatabase } from "./mongodb"
import PasswordReset from "@/models/PasswordReset"

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  await connectToDatabase()

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Create new user
  const user = new User(userData)
  await user.save()

  // Remove password from response
  const userObject = user.toObject()
  delete userObject.password

  return userObject
}

export async function authenticateUser(email: string, password: string) {
  await connectToDatabase()

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new Error("Invalid email or password")
  }

  // Create JWT token
  const token = await createToken({
    id: user._id.toString(),
    email: user.email,
  })

  // Remove password from response
  const userObject = user.toObject()
  delete userObject.password

  return { user: userObject, token }
}

export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return verified.payload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}

export function getAuthToken(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  return token
}

export async function getCurrentUser(request: NextRequest) {
  const token = getAuthToken(request)
  if (!token) return null

  try {
    const payload = await verifyToken(token)
    await connectToDatabase()

    const user = await User.findById(payload.id).select("-password")
    if (!user) return null

    return user
  } catch (error) {
    return null
  }
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}

export async function createPasswordResetToken(email: string) {
  await connectToDatabase()

  // Check if user exists
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("User with this email does not exist")
  }

  // Generate a 6-digit token
  const token = Math.floor(100000 + Math.random() * 900000).toString()

  // Delete any existing tokens for this user
  await PasswordReset.deleteMany({ email })

  // Create new token
  const passwordReset = new PasswordReset({
    email,
    token,
  })

  await passwordReset.save()

  return token
}

export async function verifyPasswordResetToken(email: string, token: string) {
  await connectToDatabase()

  const passwordReset = await PasswordReset.findOne({ email, token })
  if (!passwordReset) {
    throw new Error("Invalid or expired token")
  }

  return true
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  await connectToDatabase()

  // Verify token
  const isValid = await verifyPasswordResetToken(email, token)
  if (!isValid) {
    throw new Error("Invalid or expired token")
  }

  // Update user password
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("User not found")
  }

  user.password = newPassword
  await user.save()

  // Delete the token
  await PasswordReset.deleteMany({ email })

  return true
}
