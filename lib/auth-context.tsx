"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabaseBrowser } from "./supabaseClient"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export type UserType = "customer" | "business"

export interface User {
  id: string
  email: string
  name: string
  type: UserType
  avatar?: string
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, type: UserType, brandName?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          setSupabaseUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setSupabaseUser(null)
          setUser(null)
          setLoading(false)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (error) throw error

      if (profile) {
        if (profile.user_type === "customer") {
          const { data: customer } = await supabaseBrowser
            .from("customers")
            .select("*")
            .eq("id", userId)
            .maybeSingle()

          if (customer) {
            setUser({
              id: userId,
              email: profile.email,
              name: customer.name,
              type: "customer",
              avatar: customer.avatar_url,
            })
          }
        } else {
          const { data: business } = await supabaseBrowser
            .from("businesses")
            .select("*")
            .eq("id", userId)
            .maybeSingle()

          if (business) {
            setUser({
              id: userId,
              email: profile.email,
              name: business.name,
              type: "business",
              avatar: business.logo_url,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user.id)
        return { success: true }
      }

      return { success: false, error: "Login failed" }
    } catch (error: any) {
      setLoading(false)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    type: UserType,
    brandName?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)

    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabaseBrowser.from("profiles").insert({
          id: data.user.id,
          email,
          user_type: type,
        })

        if (profileError) throw profileError

        if (type === "customer") {
          const { error: customerError } = await supabaseBrowser.from("customers").insert({
            id: data.user.id,
            name,
          })

          if (customerError) throw customerError
        } else {
          const { error: businessError } = await supabaseBrowser.from("businesses").insert({
            id: data.user.id,
            name: brandName || name,
          })

          if (businessError) throw businessError
        }

        await loadUserProfile(data.user.id)
        return { success: true }
      }

      return { success: false, error: "Signup failed" }
    } catch (error: any) {
      setLoading(false)
      return { success: false, error: error.message || "Signup failed" }
    }
  }

  const logout = async () => {
    await supabaseBrowser.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return <AuthContext.Provider value={{ user, supabaseUser, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
