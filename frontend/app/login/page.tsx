import { LoginForm } from "@/frontend/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image src="/neu-logo.png" alt="Near East University" width={80} height={80} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Near East University</h1>
          <p className="text-muted-foreground">Task Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
