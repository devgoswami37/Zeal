import type { Metadata } from "next"
import LoginForm from "./login-form"
import Header from "@/app/components/header"

export const metadata: Metadata = {
  title: "Login | ZEAL Decor",
  description: "Login to your ZEAL Decor account",
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <LoginForm />
      </div>
      </div>
    </>
  )
}
