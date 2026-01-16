"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, authService } from "@/frontend/lib/auth"

interface AuthContextType extends AuthState {
  login: (studentNumber: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthProvider initializing...")
    const currentUser = authService.getCurrentUser()
    console.log("[v0] Current user from localStorage:", currentUser)
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (studentNumber: string, password: string) => {
    console.log("[v0] AuthContext login called with:", studentNumber)
    setIsLoading(true)
    try {
      const user = await authService.login(studentNumber, password)
      console.log("[v0] Login service returned user:", user)
      setUser(user)
      return user
    } catch (error) {
      console.log("[v0] Login error in context:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
