"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserType = "customer" | "brand"

export interface User {
  id: string
  email: string
  name: string
  type: UserType
  tier?: "BRONZE" | "SILVER" | "GOLD" | "VIP" // Only for customers
  brandName?: string // Only for brands
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, type: UserType) => Promise<boolean>
  signup: (email: string, password: string, name: string, type: UserType, brandName?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("dani-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, type: UserType): Promise<boolean> => {
    setLoading(true)

    localStorage.removeItem("dani-messages")
    localStorage.removeItem("dani-conversations")
    localStorage.removeItem("dani-memberships")

    // Mock authentication - in real app, this would call your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on type
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: type === "customer" ? "Sarah Johnson" : "SKIMS Team",
      type,
      ...(type === "customer" && {
        tier: "VIP" as const,
        avatar: "/customer-profile-.jpg",
      }),
      ...(type === "brand" && {
        brandName: "SKIMS",
      }),
    }

    setUser(mockUser)
    localStorage.setItem("dani-user", JSON.stringify(mockUser))
    setLoading(false)
    return true
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    type: UserType,
    brandName?: string,
  ): Promise<boolean> => {
    setLoading(true)

    localStorage.removeItem("dani-messages")
    localStorage.removeItem("dani-conversations")
    localStorage.removeItem("dani-memberships")
    localStorage.removeItem("dani-user-preferences")

    // Mock signup - in real app, this would call your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      type,
      ...(type === "customer" && {
        tier: "BRONZE" as const,
      }),
      ...(type === "brand" && {
        brandName: brandName || "Your Brand",
      }),
    }

    setUser(mockUser)
    localStorage.setItem("dani-user", JSON.stringify(mockUser))
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dani-user")
    localStorage.removeItem("dani-messages")
    localStorage.removeItem("dani-conversations")
    localStorage.removeItem("dani-memberships")
    localStorage.removeItem("dani-user-preferences")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
