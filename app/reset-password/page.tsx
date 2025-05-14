import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Header from "@/app/components/header"
import { Suspense } from "react"

const ResetPasswordForm = dynamic(() => import("./reset-password-form"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Reset Password | ZEAL Decor",
  description: "Reset your ZEAL Decor account password",
}

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16 max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Reset your password</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  )
}
