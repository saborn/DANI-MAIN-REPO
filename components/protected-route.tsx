"use client"

import type React from "react"

import { useAuth, type UserType } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, Sparkles } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType: UserType
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to appropriate auth page
        const authPath = requiredUserType === "customer" ? "/customer/auth" : "/store/auth"
        router.push(authPath)
      } else if (user.type !== requiredUserType) {
        // User is logged in but wrong type, redirect to their appropriate dashboard
        const redirectPath = user.type === "customer" ? "/customer" : "/store"
        router.push(redirectPath)
      }
    }
  }, [user, loading, requiredUserType, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold">DANI</h1>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.type !== requiredUserType) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
