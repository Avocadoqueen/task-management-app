import type React from "react"
import type { Metadata } from "next"
// Removed unused/unsupported Google font imports to avoid build errors
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import "./globals.css"

// using default font classes

export const metadata: Metadata = {
  title: "TaskFlow - Educational Task Management",
  description: "Manage assignments, deadlines, and projects efficiently",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
