"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Users, ShoppingBag, TrendingUp } from "lucide-react"
import { mockStores, getStoreInventory, getCustomersByStore } from "@/lib/mock-db"
import { ProtectedRoute } from "@/components/protected-route"

export default function StoreProfilePage() {
  const selectedStoreId = 1 // In real app, this would come from auth/context
  const currentStore = mockStores.find((s) => s.id === selectedStoreId)
  const inventory = getStoreInventory(selectedStoreId)
  const customers = getCustomersByStore(selectedStoreId)

  if (!currentStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Store not found</p>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredUserType="brand">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/store">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
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

            {/* Store Header */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 shadow-lg border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                  {currentStore.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-bold text-3xl text-foreground mb-2">{currentStore.name}</h1>
                <p className="text-lg text-muted-foreground mb-3">{currentStore.description}</p>
                <Badge className="bg-primary text-primary-foreground shadow-sm text-base px-4 py-2">Active Store</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Store Analytics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Store Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{customers.length}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{inventory.length}</p>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {customers.filter((c) => c.status === "vip").length}
                    </p>
                    <p className="text-sm text-muted-foreground">VIP Customers</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Tiers */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Customer Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["bronze", "silver", "gold", "vip"].map((tier) => {
                    const tierCount = customers.filter((c) => c.status === tier).length
                    const tierColors = {
                      bronze: "bg-amber-600",
                      silver: "bg-gray-500",
                      gold: "bg-yellow-500",
                      vip: "bg-purple-600",
                    }

                    return (
                      <div key={tier} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${tierColors[tier]}`} />
                          <span className="font-semibold capitalize">{tier}</span>
                        </div>
                        <Badge variant="outline">{tierCount} customers</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Recent Inventory
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-96">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-primary">${item.price}</span>
                        <span className="text-xs text-muted-foreground">{item.date_added}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
