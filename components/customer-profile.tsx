import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Building, Phone, Mail, Calendar } from "lucide-react"
import type { Customer } from "@/lib/db-types"

interface CustomerProfileProps {
  customer: Customer
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
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

  const getStatusLabel = (status: Customer["status"]) => {
    return status.toUpperCase()
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                customer.avatar_url ||
                `/customer-profile-.jpg?key=syi9r&height=64&width=64&query=customer+profile+${customer.name}`
              }
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{customer.name}</CardTitle>
            <Badge className={`${getStatusColor(customer.status)} mt-2`}>
              {getStatusLabel(customer.status)} Member
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.company && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{customer.company}</span>
            </div>
          )}
          {customer.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Member since {new Date(customer.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        {customer.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Notes:</strong> {customer.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
