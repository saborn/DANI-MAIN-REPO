// Real-time messaging simulation using custom events and localStorage
import type { Message } from "./db-types"

export type MessageEvent = {
  type: "new_message"
  message: Message
  customerId: number
  storeId: number
}

export type StatusEvent = {
  type: "status_change"
  customerId: number
  status: string
}

export type RealtimeEvent = MessageEvent | StatusEvent

class RealtimeManager {
  private listeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map()
  private pollInterval: NodeJS.Timeout | null = null
  private lastMessageId = 0

  constructor() {
    // Initialize with current max message ID
    this.initializeLastMessageId()
    this.startPolling()
  }

  private initializeLastMessageId() {
    if (typeof window === "undefined") {
      this.lastMessageId = 0
      return
    }
    const stored = localStorage.getItem("lastMessageId")
    this.lastMessageId = stored ? Number.parseInt(stored, 10) : 0
  }

  private startPolling() {
    if (typeof window === "undefined") {
      return
    }
    // Poll every 2 seconds for new messages
    this.pollInterval = setInterval(() => {
      this.checkForUpdates()
    }, 2000)
  }

  private checkForUpdates() {
    if (typeof window === "undefined") {
      return
    }
    // Check localStorage for new messages
    const messagesData = localStorage.getItem("realtimeMessages")
    if (messagesData) {
      try {
        const messages: Message[] = JSON.parse(messagesData)
        const newMessages = messages.filter((msg) => msg.id > this.lastMessageId)

        newMessages.forEach((message) => {
          this.lastMessageId = Math.max(this.lastMessageId, message.id)
          this.emit({
            type: "new_message",
            message,
            customerId: message.customer_id,
            storeId: message.store_id,
          })
        })

        if (newMessages.length > 0) {
          localStorage.setItem("lastMessageId", this.lastMessageId.toString())
        }
      } catch (error) {
        console.error("Error parsing realtime messages:", error)
      }
    }
  }

  subscribe(eventType: string, callback: (event: RealtimeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private emit(event: RealtimeEvent) {
    const callbacks = this.listeners.get(event.type)
    if (callbacks) {
      callbacks.forEach((callback) => callback(event))
    }
  }

  // Broadcast a new message to other tabs/windows
  broadcastMessage(message: Message) {
    if (typeof window === "undefined") {
      return
    }
    const existingMessages = this.getStoredMessages()
    const updatedMessages = [...existingMessages, message]
    localStorage.setItem("realtimeMessages", JSON.stringify(updatedMessages))

    // Also emit locally for immediate update
    this.emit({
      type: "new_message",
      message,
      customerId: message.customer_id,
      storeId: message.store_id,
    })
  }

  private getStoredMessages(): Message[] {
    if (typeof window === "undefined") {
      return []
    }
    const stored = localStorage.getItem("realtimeMessages")
    return stored ? JSON.parse(stored) : []
  }

  // Simulate typing indicators
  broadcastTyping(customerId: number, storeId: number, senderType: "customer" | "store", isTyping: boolean) {
    if (typeof window === "undefined") {
      return
    }
    const event = new CustomEvent("typing", {
      detail: { customerId, storeId, senderType, isTyping },
    })
    window.dispatchEvent(event)
  }

  subscribeToTyping(
    callback: (data: {
      customerId: number
      storeId: number
      senderType: "customer" | "store"
      isTyping: boolean
    }) => void,
  ) {
    if (typeof window === "undefined") {
      return () => {}
    }
    const handler = (event: CustomEvent) => {
      callback(event.detail)
    }
    window.addEventListener("typing", handler as EventListener)

    return () => {
      window.removeEventListener("typing", handler as EventListener)
    }
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
    this.listeners.clear()
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager()

// Hook for React components
export function useRealtime() {
  return realtimeManager
}
