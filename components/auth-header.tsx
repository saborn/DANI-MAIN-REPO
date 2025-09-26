"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"

export function AuthHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border-b border-border">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-semibold text-sm">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>

      {user.type === "customer" && user.tier && (
        <Badge className="bg-primary text-primary-foreground">{user.tier}</Badge>
      )}

      {user.type === "brand" && user.brandName && <Badge variant="outline">{user.brandName}</Badge>}

      <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
}
