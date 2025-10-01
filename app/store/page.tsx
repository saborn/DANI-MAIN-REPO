"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, ImageIcon, MessageCircle, Users, Search, ArrowLeft, User } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { supabaseDb } from "@/lib/supabase-db"
import type { Conversation, Message } from "@/lib/supabase-db"

export default function StoreDashboard() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.id) {
      loadConversations()
    }
  }, [user?.id])

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id)

      const unsubscribe = supabaseDb.subscribeToMessages(selectedConversation.id, (newMsg) => {
        setMessages((prev) => [...prev, newMsg])
        if (newMsg.sender_id !== user?.id) {
          supabaseDb.markMessagesAsRead(selectedConversation.id, user?.id || "")
        }
      })

      return () => unsubscribe()
    }
  }, [selectedConversation?.id, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadConversations = async () => {
    if (!user?.id) return
    const convos = await supabaseDb.getConversationsForBusiness(user.id)
    setConversations(convos)
    if (convos.length > 0 && !selectedConversation) {
      setSelectedConversation(convos[0])
    }
  }

  const loadMessages = async (conversationId: string) => {
    const msgs = await supabaseDb.getMessages(conversationId)
    setMessages(msgs)
    if (user?.id) {
      await supabaseDb.markMessagesAsRead(conversationId, user.id)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return

    setIsLoading(true)

    await supabaseDb.sendMessage(selectedConversation.id, user.id, "business", newMessage.trim())

    setNewMessage("")
    setIsLoading(false)
  }

  const handleImageSelect = async (imageUrl: string) => {
    if (!selectedConversation || !user?.id) return

    setIsLoading(true)

    await supabaseDb.sendMessage(selectedConversation.id, user.id, "business", undefined, imageUrl)

    setShowImageUpload(false)
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ProtectedRoute requiredUserType="brand">
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r border-border flex flex-col h-screen">
          <Card className="border-b border-border rounded-none flex-shrink-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user?.name || "Store Dashboard"}</h3>
                  <p className="text-sm text-muted-foreground">Manage customer conversations</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/store/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-transparent"
                      title="Store Profile"
                    >
                      <User className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                  </Link>
                  <div className="w-2 h-2 bg-accent rounded-full" title="Online" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No customers found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className={`mb-2 cursor-pointer transition-colors hover:bg-accent/5 ${
                        selectedConversation?.id === conv.id ? "bg-accent/10 border-accent" : ""
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {conv.customer?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{conv.customer?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{conv.customer?.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <Card className="border-b border-border rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedConversation.customer?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{selectedConversation.customer?.name}</h2>
                        <p className="text-sm text-muted-foreground">{selectedConversation.customer?.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {showImageUpload && (
                      <ImageUpload
                        onImageSelect={handleImageSelect}
                        onCancel={() => setShowImageUpload(false)}
                        className="mb-4"
                      />
                    )}

                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_type === "business" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_type === "business"
                                ? "bg-accent text-accent-foreground"
                                : "bg-card text-card-foreground border border-border"
                            }`}
                          >
                            {message.image_url && (
                              <img
                                src={message.image_url || "/placeholder.svg"}
                                alt="Shared image"
                                className="rounded mb-2 max-w-full h-auto"
                              />
                            )}
                            {message.message_text && <p className="text-sm leading-relaxed">{message.message_text}</p>}
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_type === "business" ? "text-accent-foreground/70" : "text-muted-foreground"
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

              <Card className="border-t border-border rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 bg-transparent"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()} className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Customer</h3>
                <p className="text-muted-foreground">Choose a customer from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
