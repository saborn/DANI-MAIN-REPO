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
import { Send, Image as ImageIcon, MessageCircle, ArrowLeft, User, Plus, Search } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { supabaseDb } from "@/lib/supabase-db"
import type { Conversation, Message, BusinessProfile, Membership } from "@/lib/supabase-db"

export default function CustomerMessagingPage() {
  const { user } = useAuth()
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [allBusinesses, setAllBusinesses] = useState<BusinessProfile[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const activeBusiness = activeConversation?.business

  useEffect(() => {
    if (user?.id) {
      loadConversations()
      loadMemberships()
      loadAllBusinesses()
    }
  }, [user?.id])

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId)

      const unsubscribe = supabaseDb.subscribeToMessages(activeConversationId, (newMsg) => {
        setMessages((prev) => [...prev, newMsg])
        if (newMsg.sender_id !== user?.id) {
          supabaseDb.markMessagesAsRead(activeConversationId, user?.id || "")
        }
      })

      return () => unsubscribe()
    }
  }, [activeConversationId, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadConversations = async () => {
    if (!user?.id) return
    const convos = await supabaseDb.getConversationsForCustomer(user.id)
    setConversations(convos)
    if (convos.length > 0 && !activeConversationId) {
      setActiveConversationId(convos[0].id)
    }
  }

  const loadMemberships = async () => {
    if (!user?.id) return
    const mems = await supabaseDb.getCustomerMemberships(user.id)
    setMemberships(mems)
  }

  const loadAllBusinesses = async () => {
    const businesses = await supabaseDb.getAllBusinesses()
    setAllBusinesses(businesses)
  }

  const loadMessages = async (conversationId: string) => {
    const msgs = await supabaseDb.getMessages(conversationId)
    setMessages(msgs)
    if (user?.id) {
      await supabaseDb.markMessagesAsRead(conversationId, user.id)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId || !user?.id) return

    setIsLoading(true)

    await supabaseDb.sendMessage(activeConversationId, user.id, "customer", newMessage.trim())

    setNewMessage("")
    setIsLoading(false)
  }

  const handleImageSelect = async (imageUrl: string) => {
    if (!activeConversationId || !user?.id) return

    setIsLoading(true)

    await supabaseDb.sendMessage(activeConversationId, user.id, "customer", undefined, imageUrl)

    setShowImageUpload(false)
    setIsLoading(false)
  }

  const handleStartNewConversation = async (businessId: string) => {
    if (!user?.id) return

    setIsLoading(true)

    await supabaseDb.createMembership(user.id, businessId)

    const conversation = await supabaseDb.getOrCreateConversation(user.id, businessId)

    if (conversation) {
      await loadConversations()
      await loadMemberships()
      setActiveConversationId(conversation.id)
    }

    setShowNewMessage(false)
    setSearchQuery("")
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMembershipStatus = (businessId: string): string => {
    const membership = memberships.find((m) => m.business_id === businessId)
    return membership?.status || "bronze"
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

  const filteredBusinesses = allBusinesses.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const conversationsWithStatus = conversations.map((conv) => {
    const lastMessage = messages.filter((m) => m.conversation_id === conv.id).pop()
    return {
      ...conv,
      status: getMembershipStatus(conv.business_id),
      last_message: lastMessage?.message_text || "Start a conversation",
      last_message_time: lastMessage?.created_at || conv.created_at,
    }
  })

  return (
    <ProtectedRoute requiredUserType="customer">
      <div className="flex h-screen bg-background">
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
                      {filteredBusinesses.slice(0, 6).map((business) => (
                        <button
                          key={business.id}
                          onClick={() => handleStartNewConversation(business.id)}
                          className="w-full p-3 text-left rounded-lg hover:bg-sidebar-primary/30 transition-colors border border-sidebar-border/50 bg-background/30"
                          disabled={isLoading}
                        >
                          <div className="font-semibold text-sm truncate flex-1 mr-2">{business.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{business.description}</div>
                        </button>
                      ))}
                      {filteredBusinesses.length > 6 && (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          +{filteredBusinesses.length - 6} more brands...
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
                {conversationsWithStatus.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md animate-fade-in ${
                      activeConversationId === conv.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                        : "hover:bg-sidebar-primary bg-card border border-sidebar-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm truncate flex-1 mr-2">{conv.business?.name}</span>
                      <Badge className={`${getStatusColor(conv.status)} shadow-sm flex-shrink-0`} variant="secondary">
                        {conv.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p
                      className={`text-xs truncate leading-relaxed mb-2 ${
                        activeConversationId === conv.id ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {conv.last_message}
                    </p>
                    {conv.last_message_time && (
                      <p
                        className={`text-xs font-medium ${
                          activeConversationId === conv.id ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(conv.last_message_time).toLocaleDateString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <Card className="border-b border-border rounded-none shadow-sm bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 p-6">
              <Avatar className="h-12 w-12 shadow-md">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {activeBusiness?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-bold text-xl text-foreground">{activeBusiness?.name}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeBusiness?.description}</p>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Support Chat</span>
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-sm" title="Online" />
              </div>
            </div>
          </Card>

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
                      No messages yet. Start a conversation with {activeBusiness?.name}!
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
                        {message.image_url && (
                          <img
                            src={message.image_url || "/placeholder.svg"}
                            alt="Shared image"
                            className="rounded-xl mb-3 max-w-full h-auto shadow-sm"
                          />
                        )}
                        {message.message_text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message_text}</p>
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

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

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
                placeholder={`Message ${activeBusiness?.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !activeConversationId}
                className="flex-1 bg-input/50 border-border focus:bg-background transition-colors"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim() || !activeConversationId}
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
