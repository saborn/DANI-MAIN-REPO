import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

// Mock current customer ID - in a real app, this would come from authentication
const CURRENT_CUSTOMER_ID = 1

export async function GET() {
  try {
    const memberships = await DatabaseService.getMembershipsByCustomer(CURRENT_CUSTOMER_ID)
    
    const conversations = await Promise.all(
      memberships.map(async (membership) => {
        const messages = await DatabaseService.getMessagesBetween(CURRENT_CUSTOMER_ID, membership.store_id)
        const lastMessage = messages[messages.length - 1]
        
        return {
          store_id: membership.store_id,
          store_name: membership.store_name,
          status: membership.status,
          last_message: lastMessage?.message_text || "No messages yet",
          last_message_time: lastMessage?.created_at || "",
          unread_count: messages.filter(m => !m.is_read && m.sender_type === 'store').length,
        }
      })
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("[v0] Conversations API error:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
