import { NextResponse } from "next/server"
import { getMessagesBetween, addMessage } from "@/lib/mock-db"

// Mock current customer ID - in a real app, this would come from authentication
const CURRENT_CUSTOMER_ID = 1

export async function GET(_req: Request, { params }: { params: { conversationId: string } }) {
  try {
    if (!params.conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const storeId = parseInt(params.conversationId)
    const messages = getMessagesBetween(CURRENT_CUSTOMER_ID, storeId)

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[v0] Messages GET API error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { conversationId: string } }) {
  try {
    if (!params.conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const { body } = await req.json()

    if (!body || typeof body !== "string") {
      return NextResponse.json({ error: "Message body is required" }, { status: 400 })
    }

    const storeId = parseInt(params.conversationId)
    
    const newMessage = addMessage({
      customer_id: CURRENT_CUSTOMER_ID,
      store_id: storeId,
      sender_type: "customer",
      message_text: body,
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("[v0] Messages POST API error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
