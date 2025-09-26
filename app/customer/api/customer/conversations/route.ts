import { NextResponse } from "next/server"
import { getConversationThreads } from "@/lib/mock-db"

// Mock current customer ID - in a real app, this would come from authentication
const CURRENT_CUSTOMER_ID = 1

export async function GET() {
  try {
    const conversations = getConversationThreads(CURRENT_CUSTOMER_ID)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error("[v0] Conversations API error:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
