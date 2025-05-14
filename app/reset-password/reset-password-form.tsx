// reset-password-form.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"verify" | "reset">("verify")
  const { verifyToken, resetPassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const isValid = await verifyToken(email, token)
      if (isValid) {
        setStep("reset")
      } else {
        setError("Invalid or expired verification code")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await resetPassword(email, token, password)
      router.push("/login?reset=success")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      {step === "verify" ? (
        <div>
          <p className="text-center mb-6">Enter the 6-digit verification code sent to your email.</p>
          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Verification Code"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {loading ? "VERIFYING..." : "VERIFY CODE"}
            </button>
            <div className="text-center">
              <Link href="/forgot-password" className="hover:text-gray-600">
                Resend Code
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <p className="text-center mb-6">Enter your new password.</p>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={6}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                minLength={6}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
