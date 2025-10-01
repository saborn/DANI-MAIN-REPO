"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, type UserType } from "@/lib/auth-context"
import { Loader as Loader2, Sparkles, ArrowLeft } from "lucide-react"

interface AuthFormProps {
  type: UserType
  onSuccess: () => void
}

export function AuthForm({ type, onSuccess }: AuthFormProps) {
  const { login, signup, loading } = useAuth()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    brandName: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          onSuccess()
        } else {
          setError(result.error || "Authentication failed. Please try again.")
        }
      } else {
        const result = await signup(
          formData.email,
          formData.password,
          formData.name,
          type,
          type === "business" ? formData.brandName : undefined,
        )
        if (result.success) {
          onSuccess()
        } else {
          setError(result.error || "Authentication failed. Please try again.")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const title = type === "customer" ? "VIP Customer Portal" : "Brand Dashboard"
  const description =
    type === "customer" ? "Access your exclusive shopping experience" : "Manage your VIP customer relationships"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">DANI</h1>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TabsContent value="login" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="name">{type === "customer" ? "Full Name" : "Contact Name"}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={type === "customer" ? "Enter your full name" : "Enter contact name"}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                {type === "business" && (
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      type="text"
                      placeholder="Enter your brand name"
                      value={formData.brandName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brandName: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </TabsContent>

              {error && (
                <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded">{error}</div>
              )}

              <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
