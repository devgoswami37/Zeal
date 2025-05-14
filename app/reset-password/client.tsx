"use client" // This marks the file as a client component

import dynamic from "next/dynamic"

// Dynamically import the ResetPasswordForm component (with ssr: false)
const ResetPasswordForm = dynamic(() => import("./reset-password-form"), {
  ssr: false,
})

export default function ClientResetPassword() {
  return <ResetPasswordForm />
}
