import { NextResponse } from "next/server"
import { getCustomerById, getCustomerAnalytics } from "@/lib/mock-db"

// Mock current customer ID - in a real app, this would come from authentication
const CURRENT_CUSTOMER_ID = 1

export async function GET() {
  try {
    const customer = getCustomerById(CURRENT_CUSTOMER_ID)
    const analytics = getCustomerAnalytics(CURRENT_CUSTOMER_ID)

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        company: customer.company,
        location: customer.location,
        notes: customer.notes,
        created_at: customer.created_at,
      },
      purchases: customer.purchases || [],
      memberships: customer.memberships || [],
      analytics,
    })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
  }
}
