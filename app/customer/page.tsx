"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ImageIcon, MessageCircle, ArrowLeft, User, Plus, Search } from "lucide-react"
import {
  mockCustomers,
  getMessagesBetween,
  addMessage,
  addImageMessage,
  getConversationThreads,
  mockStores,
} from "@/lib/mock-db"
import type { MessageWithSender } from "@/lib/db-types"
import { ImageUpload } from "@/components/image-upload"
import { useRealtime } from "@/lib/realtime"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"
import { TypingIndicator } from "@/components/typing-indicator"
import { ProtectedRoute } from "@/components/protected-route"

// Mock current customer (in real app, this would come from auth)
const CURRENT_CUSTOMER_ID = 1

export default function CustomerMessagingPage() {
  const [activeStoreId, setActiveStoreId] = useState<number>(1)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStores, setFilteredStores] = useState(mockStores)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const realtime = useRealtime()

  const { otherUserTyping, startTyping, stopTyping } = useTypingIndicator(
    CURRENT_CUSTOMER_ID,
    activeStoreId,
    "customer",
  )

  const currentCustomer = mockCustomers.find((c) => c.id === CURRENT_CUSTOMER_ID)
  const conversationThreads = getConversationThreads(CURRENT_CUSTOMER_ID)
  const activeStore = mockStores.find((s) => s.id === activeStoreId)

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockStores.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredStores(filtered)
    } else {
      setFilteredStores(mockStores)
    }
  }, [searchQuery])

  useEffect(() => {
    const initialMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, activeStoreId)
    setMessages(initialMessages)

    const unsubscribe = realtime.subscribe("new_message", (event) => {
      if (event.type === "new_message" && event.customerId === CURRENT_CUSTOMER_ID && event.storeId === activeStoreId) {
        const updatedMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, activeStoreId)
        setMessages(updatedMessages)
      }
    })

    return unsubscribe
  }, [realtime, activeStoreId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)
    stopTyping()

    addMessage({
      customer_id: CURRENT_CUSTOMER_ID,
      store_id: activeStoreId,
      sender_type: "customer",
      message_text: newMessage.trim(),
    })

    const updatedMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, activeStoreId)
    setMessages(updatedMessages)
    setNewMessage("")
    setIsLoading(false)
  }

  const handleImageSelect = (imageUrl: string) => {
    setIsLoading(true)

    addImageMessage({
      customer_id: CURRENT_CUSTOMER_ID,
      store_id: activeStoreId,
      sender_type: "customer",
      image_url: imageUrl,
    })

    const updatedMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, activeStoreId)
    setMessages(updatedMessages)
    setShowImageUpload(false)
    setIsLoading(false)
  }

  const handleStartNewConversation = (storeId: number) => {
    setActiveStoreId(storeId)
    setShowNewMessage(false)
    setSearchQuery("")

    const existingMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, storeId)
    if (existingMessages.length === 0) {
      const store = mockStores.find((s) => s.id === storeId)
      addMessage({
        customer_id: CURRENT_CUSTOMER_ID,
        store_id: storeId,
        sender_type: "store",
        message_text: `Welcome to ${store?.name}! How can we assist you today?`,
      })

      const updatedMessages = getMessagesBetween(CURRENT_CUSTOMER_ID, storeId)
      setMessages(updatedMessages)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (e.target.value.trim()) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const getStatusColor = (status: string) => {
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

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredUserType="customer">
      <div className="flex h-screen bg-background">
        {/* Left Sidebar - Conversation Threads */}
        <div className="w-80 border-r border-border bg-sidebar flex flex-col shadow-sm h-screen">
          <div className="p-6 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/customer/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shadow-sm"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-sidebar-foreground mb-1">Your Brands</h3>
                  <p className="text-sm text-muted-foreground">VIP conversations</p>
                </div>
                <Button
                  onClick={() => setShowNewMessage(!showNewMessage)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {showNewMessage && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-sidebar-primary/95 backdrop-blur-sm rounded-xl border border-sidebar-border animate-fade-in shadow-xl z-50">
                  <h4 className="font-semibold text-sm mb-3 text-sidebar-foreground">Start New Conversation</h4>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fashion brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-sidebar-border"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredStores.slice(0, 6).map((store) => (
                        <button
                          key={store.id}
                          onClick={() => handleStartNewConversation(store.id)}
                          className="w-full p-3 text-left rounded-lg hover:bg-sidebar-primary/30 transition-colors border border-sidebar-border/50 bg-background/30"
                        >
                          <div className="font-semibold text-sm truncate flex-1 mr-2">{store.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{store.description}</div>
                        </button>
                      ))}
                      {filteredStores.length > 6 && (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          +{filteredStores.length - 6} more brands...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {conversationThreads.map((thread) => (
                  <button
                    key={thread.store_id}
                    onClick={() => setActiveStoreId(thread.store_id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md animate-fade-in ${
                      activeStoreId === thread.store_id
                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                        : "hover:bg-sidebar-primary bg-card border border-sidebar-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm truncate flex-1 mr-2">{thread.store_name}</span>
                      <Badge className={`${getStatusColor(thread.status)} shadow-sm flex-shrink-0`} variant="secondary">
                        {thread.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p
                      className={`text-xs truncate leading-relaxed mb-2 ${
                        activeStoreId === thread.store_id ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {thread.last_message}
                    </p>
                    {thread.last_message_time && (
                      <p
                        className={`text-xs font-medium ${
                          activeStoreId === thread.store_id ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(thread.last_message_time).toLocaleDateString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <Card className="border-b border-border rounded-none shadow-sm bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 p-6">
              <Avatar className="h-12 w-12 shadow-md">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {activeStore?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-bold text-xl text-foreground">{activeStore?.name}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeStore?.description}</p>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Support Chat</span>
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-sm" title="Online" />
              </div>
            </div>
          </Card>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background to-muted/20">
              <div className="space-y-6 max-w-4xl mx-auto">
                {showImageUpload && (
                  <div className="animate-slide-in">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onCancel={() => setShowImageUpload(false)}
                      className="mb-4"
                    />
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                    <p className="text-muted-foreground text-lg">
                      No messages yet. Start a conversation with {activeStore?.name}!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex animate-fade-in ${message.sender_type === "customer" ? "justify-end" : "justify-start"}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`max-w-[280px] lg:max-w-[320px] px-4 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 break-words ${
                          message.sender_type === "customer"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-card-foreground border border-border"
                        }`}
                      >
                        {message.sender_type === "store" && (
                          <p className="text-xs text-muted-foreground mb-2 font-medium truncate">
                            {message.sender_name}
                          </p>
                        )}
                        {message.image_url && (
                          <img
                            src={message.image_url || "/placeholder.svg"}
                            alt="Shared image"
                            className="rounded-xl mb-3 max-w-full h-auto shadow-sm"
                          />
                        )}
                        {message.message_text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.message_text}
                          </p>
                        )}
                        <p
                          className={`text-xs mt-2 font-medium ${
                            message.sender_type === "customer" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                <TypingIndicator isVisible={otherUserTyping} senderName={`${activeStore?.name} Support`} />
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <Card className="border-t border-border rounded-none shadow-lg bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-6 max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                placeholder={`Message ${activeStore?.name}...`}
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onBlur={stopTyping}
                disabled={isLoading}
                className="flex-1 bg-input/50 border-border focus:bg-background transition-colors"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
