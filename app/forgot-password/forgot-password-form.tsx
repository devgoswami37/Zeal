"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { forgotPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await forgotPassword(email)
      setEmailSent(true)
      // Redirect to verification page
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="text-center mb-6">We will send you an email to reset your password.</p>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      {emailSent ? (
        <div className="text-center">
          <p className="mb-4">We&apos;ve sent a verification code to {email}. Please check your email.</p>
          <Link
            href={`/reset-password?email=${encodeURIComponent(email)}`}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Enter Verification Code
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            {loading ? "SUBMITTING..." : "SUBMIT"}
          </button>

          <div className="text-center">
            <Link href="/login" className="hover:text-gray-600">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
