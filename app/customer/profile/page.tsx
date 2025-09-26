// app/customer/profile/page.tsx
"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, ShoppingBag, Heart, Plus, Upload, X } from "lucide-react"
// REMOVE mock imports
// import { mockCustomers, mockStores } from "@/lib/mock-db"
import { ProtectedRoute } from "@/components/protected-route"
import { useEffect, useState } from "react"

export default function CustomerProfilePage() {
  // Bubble-backed state
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [memberships, setMemberships] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newInspiration, setNewInspiration] = useState({
    name: "",
    style: "",
    image: null as File | null,
    imagePreview: "",
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const r = await fetch("/api/customer/profile")
      const data = await r.json()
      setProfile(data.profile)
      setMemberships(data.memberships)
      setPurchases(data.purchases)
      setLoading(false)
    })()
  }, [])

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "bronze":
        return "bg-amber-600 text-white"
      case "silver":
        return "bg-gray-500 text-white"
      case "gold":
        return "bg-yellow-500 text-white"
      case "vip":
        return "bg-purple-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewInspiration((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewInspiration((prev) => ({ ...prev, imagePreview: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitInspiration = () => {
    console.log("[v0] New inspiration:", newInspiration)
    setNewInspiration({ name: "", style: "", image: null, imagePreview: "" })
    setShowUploadForm(false)
  }

  const handleCancelUpload = () => {
    setNewInspiration({ name: "", style: "", image: null, imagePreview: "" })
    setShowUploadForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredUserType="customer">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/customer">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Messages
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 shadow-lg border-2 border-primary/20">
                <AvatarImage src={profile?.avatar || "/fashion-customer-profile.jpg"} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                  {String(profile?.name || "VIP")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-bold text-3xl text-foreground mb-2">{profile?.name}</h1>
                <p className="text-lg text-muted-foreground mb-3">
                  {[profile?.city, profile?.state].filter(Boolean).join(", ")}
                </p>
                <Badge className="bg-primary text-primary-foreground shadow-sm text-base px-4 py-2">
                  {(profile?.status || "VIP").toString().toUpperCase()} MEMBER
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Brand Memberships */}
            <Card className="shadow-lg">
              <div className="p-6 border-b border-border">
                <h2 className="font-bold text-xl flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  Brand Memberships
                </h2>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  {memberships?.map((m) => {
                    const brandName = m.brand?.name || "Brand"
                    const brandBio = m.brand?.bio || ""
                    const tier = (m.tier || "").toLowerCase()
                    return (
                      <div
                        key={m._id}
                        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {brandName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{brandName}</p>
                            <p className="text-sm text-muted-foreground">{brandBio}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(tier)} shadow-sm text-sm px-3 py-1`} variant="secondary">
                          {tier.toUpperCase()}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>

            {/* Recent Purchases */}
            <Card className="shadow-lg">
              <div className="p-6 border-b border-border">
                <h2 className="font-bold text-xl flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  Recent Purchases
                </h2>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  {purchases?.map((p) => (
                    <div
                      key={p._id || `${p.item_name}-${p.purchased_at}`}
                      className="flex gap-4 p-4 rounded-xl hover:bg-accent/5 transition-colors border border-border shadow-sm"
                    >
                      <img
                        src={p.thumb || "/placeholder.svg"}
                        alt={p.item_name}
                        className="w-20 h-20 rounded-xl object-cover shadow-md border border-border/50"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-1">{p.item_name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{p.brand?.name || ""}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xl text-primary">${p.price}</p>
                          <p className="text-sm text-muted-foreground">
                            {p.purchased_at ? new Date(p.purchased_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Style Inspiration (local-only for now) */}
            <Card className="shadow-lg lg:col-span-2">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary" />
                    Style Inspiration
                  </h2>
                  <Button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    Add Inspiration
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-96">
                <div className="p-6">
                  {showUploadForm && (
                    <Card className="mb-6 p-6 border-2 border-dashed border-primary/30 bg-primary/5">
                      <h3 className="font-semibold text-lg mb-4">Add New Style Inspiration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Image</label>
                          <div className="flex items-center gap-4">
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                              <Upload className="h-4 w-4" />
                              Choose File
                            </Button>
                          </div>
                          {newInspiration.imagePreview && (
                            <img
                              src={newInspiration.imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="mt-3 w-32 h-32 rounded-lg object-cover border border-border"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Name/Title</label>
                          <Input
                            value={newInspiration.name}
                            onChange={(e) => setNewInspiration((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Summer Casual Look"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Caption/Description</label>
                          <Textarea
                            value={newInspiration.style}
                            onChange={(e) => setNewInspiration((prev) => ({ ...prev, style: e.target.value }))}
                            placeholder="Describe this style inspiration..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={handleSubmitInspiration} className="flex-1">
                            Add Inspiration
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelUpload}
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* keep any local inspo grid you had */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* optional: render local inspirations here */}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
