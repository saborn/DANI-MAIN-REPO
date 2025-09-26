"use client"

import { useState, useEffect, useCallback } from "react"
import { realtimeManager } from "@/lib/realtime"

export function useTypingIndicator(customerId: number, storeId: number, senderType: "customer" | "store") {
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribeToTyping((data) => {
      if (data.customerId === customerId && data.storeId === storeId && data.senderType !== senderType) {
        setOtherUserTyping(data.isTyping)
      }
    })

    return unsubscribe
  }, [customerId, storeId, senderType])

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      realtimeManager.broadcastTyping(customerId, storeId, senderType, true)
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setIsTyping(false)
      realtimeManager.broadcastTyping(customerId, storeId, senderType, false)
    }, 2000)

    setTypingTimeout(timeout)
  }, [customerId, storeId, senderType, isTyping, typingTimeout])

  const stopTyping = useCallback(() => {
    if (isTyping) {
      setIsTyping(false)
      realtimeManager.broadcastTyping(customerId, storeId, senderType, false)
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
  }, [isTyping, typingTimeout, customerId, storeId, senderType])

  return {
    isTyping,
    otherUserTyping,
    startTyping,
    stopTyping,
  }
}
