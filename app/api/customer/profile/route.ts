import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

// Mock current customer ID - in a real app, this would come from authentication
const CURRENT_CUSTOMER_ID = 1

export async function GET() {
  try {
    const customer = await DatabaseService.getCustomerById(CURRENT_CUSTOMER_ID)
    const purchases = await DatabaseService.getPurchasesByCustomer(CURRENT_CUSTOMER_ID)
    const memberships = await DatabaseService.getMembershipsByCustomer(CURRENT_CUSTOMER_ID)
    const analytics = await DatabaseService.getCustomerAnalytics(CURRENT_CUSTOMER_ID)

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
        avatar_url: customer.avatar_url,
        created_at: customer.created_at,
      },
      purchases: purchases.map(p => ({
        id: p.id,
        item_name: p.item_name,
        store_name: p.store_name,
        price: parseFloat(p.price.toString()),
        image_url: p.image_url,
        purchase_date: p.purchase_date,
      })),
      memberships: memberships.map(m => ({
        store_id: m.store_id,
        status: m.status,
        store_name: m.store_name,
      })),
      analytics: {
        total_spend: parseFloat(analytics.total_spend.toString()),
        lifetime_purchases: parseInt(analytics.lifetime_purchases.toString()),
        avg_order_value: parseFloat(analytics.avg_order_value.toString()),
        last_visit: analytics.last_visit,
        visit_frequency: "Weekly", // This could be calculated based on purchase history
        favorite_categories: ["Athleisure", "Sneakers", "Leggings"], // This could be calculated from purchases
      },
    })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
  }
}
