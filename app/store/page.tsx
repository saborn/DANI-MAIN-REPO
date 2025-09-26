"use client"

import type React from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, ImageIcon, MessageCircle, Users, Settings, Search, ArrowLeft, User } from "lucide-react"
import {
  mockStores,
  getMessagesBetween,
  addMessage,
  addImageMessage,
  updateCustomerStatus,
  getCustomersByStore,
  getCustomerAnalytics,
} from "@/lib/mock-db"
import type { Customer, MessageWithSender } from "@/lib/db-types"
import { ImageUpload } from "@/components/image-upload"
import { useRealtime } from "@/lib/realtime"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"
import { TypingIndicator } from "@/components/typing-indicator"

export default function StoreDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const realtime = useRealtime()

  const { otherUserTyping, startTyping, stopTyping } = useTypingIndicator(
    selectedCustomer?.id || 0,
    selectedStoreId,
    "store",
  )

  const currentStore = mockStores.find((s) => s.id === selectedStoreId)

  useEffect(() => {
    const storeCustomers = getCustomersByStore(selectedStoreId)
    setCustomers(storeCustomers)
    if (storeCustomers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(storeCustomers[0])
    }
  }, [selectedStoreId, selectedCustomer])

  useEffect(() => {
    if (selectedCustomer) {
      const customerMessages = getMessagesBetween(selectedCustomer.id, selectedStoreId)
      setMessages(customerMessages)
    }
  }, [selectedCustomer, selectedStoreId])

  useEffect(() => {
    const unsubscribe = realtime.subscribe("new_message", (event) => {
      if (event.type === "new_message" && event.storeId === selectedStoreId) {
        if (selectedCustomer && event.customerId === selectedCustomer.id) {
          const updatedMessages = getMessagesBetween(selectedCustomer.id, selectedStoreId)
          setMessages(updatedMessages)
        }

        const updatedCustomers = getCustomersByStore(selectedStoreId)
        setCustomers(updatedCustomers)
      }
    })

    return unsubscribe
  }, [realtime, selectedCustomer, selectedStoreId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCustomer) return

    setIsLoading(true)
    stopTyping()

    addMessage({
      customer_id: selectedCustomer.id,
      store_id: selectedStoreId,
      sender_type: "store",
      message_text: newMessage.trim(),
    })

    const updatedMessages = getMessagesBetween(selectedCustomer.id, selectedStoreId)
    setMessages(updatedMessages)
    setNewMessage("")
    setIsLoading(false)
  }

  const handleImageSelect = (imageUrl: string) => {
    if (!selectedCustomer) return

    setIsLoading(true)

    addImageMessage({
      customer_id: selectedCustomer.id,
      store_id: selectedStoreId,
      sender_type: "store",
      image_url: imageUrl,
    })

    const updatedMessages = getMessagesBetween(selectedCustomer.id, selectedStoreId)
    setMessages(updatedMessages)
    setShowImageUpload(false)
    setIsLoading(false)
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

  const handleStatusChange = (customerId: number, newStatus: Customer["status"]) => {
    updateCustomerStatus(customerId, newStatus)
    const updatedCustomers = getCustomersByStore(selectedStoreId)
    setCustomers(updatedCustomers)
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus })
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

  const getStatusLabel = (status: string) => {
    return status.toUpperCase()
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ProtectedRoute requiredUserType="brand">
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r border-border flex flex-col h-screen">
          <Card className="border-b border-border rounded-none flex-shrink-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Settings className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <Select
                    value={selectedStoreId.toString()}
                    onValueChange={(value) => setSelectedStoreId(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">Store Dashboard</p>
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
                  <Link href="/customer">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                      <MessageCircle className="h-3 w-3" />
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
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No customers found</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className={`mb-2 cursor-pointer transition-colors hover:bg-accent/5 ${
                        selectedCustomer?.id === customer.id ? "bg-accent/10 border-accent" : ""
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`/customer-profile-.jpg?key=syi9r&height=40&width=40&query=customer+profile+${customer.name}`}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{customer.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                            <div className="mt-1">
                              <Badge className={`${getStatusColor(customer.status)} text-xs`}>
                                {getStatusLabel(customer.status)}
                              </Badge>
                            </div>
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
          {selectedCustomer ? (
            <>
              <Card className="border-b border-border rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/customer-profile-.jpg?key=syi9r&height=40&width=40&query=customer+profile+${selectedCustomer.name}`}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedCustomer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{selectedCustomer.name}</h2>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                      </div>
                      <div className="ml-4 p-3 bg-muted rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {(() => {
                            const analytics = getCustomerAnalytics(selectedCustomer.id)
                            return (
                              <>
                                <div>
                                  <p className="text-muted-foreground">Total Spend</p>
                                  <p className="font-semibold">${analytics.total_spend}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Visit Frequency</p>
                                  <p className="font-semibold">{analytics.visit_frequency}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Lifetime Orders</p>
                                  <p className="font-semibold">{analytics.lifetime_purchases}</p>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">Customer Status</p>
                        <Select
                          value={selectedCustomer.status}
                          onValueChange={(value: Customer["status"]) => handleStatusChange(selectedCustomer.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bronze">Bronze</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
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
                          className={`flex ${message.sender_type === "store" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_type === "store"
                                ? "bg-accent text-accent-foreground"
                                : "bg-card text-card-foreground border border-border"
                            }`}
                          >
                            {message.sender_type === "customer" && (
                              <p className="text-xs text-muted-foreground mb-1">{message.sender_name}</p>
                            )}
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
                                message.sender_type === "store" ? "text-accent-foreground/70" : "text-muted-foreground"
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

                    <TypingIndicator isVisible={otherUserTyping} senderName={selectedCustomer.name} />

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
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onBlur={stopTyping}
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
