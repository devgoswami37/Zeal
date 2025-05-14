import type { Metadata } from "next"
import RegisterForm from "./register-form"
import Header from "@/app/components/header"

export const metadata: Metadata = {
  title: "Create Account | ZEAL Decor",
  description: "Create a new account at ZEAL Decor",
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
        <RegisterForm />
      </div>
      </div>
    </>
  )
}
