import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-commerce Store",
  description: "Modern e-commerce store built with Next.js",
  generator: "v0.dev",
}

// In your RootLayout component, add the CartCleanup component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'