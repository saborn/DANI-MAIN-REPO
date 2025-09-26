// Mock database for demonstration purposes
import type { Store, Customer, Message, MessageWithSender } from "./db-types"
import { realtimeManager } from "./realtime"

// Mock data - in a real app, this would come from your database
export const mockStores: Store[] = [
  {
    id: 1,
    name: "ALO",
    email: "support@aloyoga.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Mindful movement. It's at the core of why we do what we do at Alo—it's our calling.",
    website: "https://aloyoga.com",
    phone: "+1-800-ALO-YOGA",
  },
  {
    id: 2,
    name: "VUORI",
    email: "support@vuori.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Performance clothing for the versatile lifestyle.",
    website: "https://vuori.com",
    phone: "+1-800-VUORI",
  },
  {
    id: 3,
    name: "NIKE",
    email: "support@nike.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Just Do It. Bringing inspiration and innovation to every athlete in the world.",
    website: "https://nike.com",
    phone: "+1-800-NIKE",
  },
  {
    id: 4,
    name: "SKIMS",
    email: "support@skims.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Solutions for every body. Underwear, loungewear and shapewear.",
    website: "https://skims.com",
    phone: "+1-800-SKIMS",
  },
  {
    id: 5,
    name: "NEW BALANCE",
    email: "support@newbalance.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Fearlessly Independent Since 1906. Athletic footwear and apparel.",
    website: "https://newbalance.com",
    phone: "+1-800-NB-SHOES",
  },
  {
    id: 6,
    name: "LEVI",
    email: "support@levi.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "The original jean. Quality never goes out of style.",
    website: "https://levi.com",
    phone: "+1-800-LEVIS",
  },
  {
    id: 7,
    name: "BANANA REPUBLIC",
    email: "support@bananarepublic.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Modern, versatile clothing for work and life.",
    website: "https://bananarepublic.com",
    phone: "+1-800-BANANA",
  },
  {
    id: 8,
    name: "GAP",
    email: "support@gap.com",
    created_at: "2024-01-01T00:00:00Z",
    description: "Casual clothing and accessories for the whole family.",
    website: "https://gap.com",
    phone: "+1-800-GAP-STYLE",
  },
]

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@example.com",
    phone: "+1234567890",
    status: "gold",
    store_id: 1,
    created_at: "2024-01-01T00:00:00Z",
    company: "Creative Agency",
    location: "Los Angeles, CA",
    notes: "Fashion enthusiast - loves athleisure",
    memberships: [
      { store_id: 1, status: "gold" },
      { store_id: 2, status: "silver" },
      { store_id: 3, status: "vip" },
      { store_id: 4, status: "bronze" },
      { store_id: 5, status: "silver" },
    ],
    purchases: [
      {
        id: 1,
        item_name: "High-Waist Shine Leggings",
        store_name: "ALO",
        price: 88,
        image_url: "/black-athletic-leggings.jpg",
        purchase_date: "2024-01-15",
      },
      {
        id: 2,
        item_name: "Air Max 270",
        store_name: "NIKE",
        price: 150,
        image_url: "/white-nike-sneakers.png",
        purchase_date: "2024-01-20",
      },
      {
        id: 3,
        item_name: "Ponto Performance Pant",
        store_name: "VUORI",
        price: 89,
        image_url: "/gray-athletic-pants.jpg",
        purchase_date: "2024-02-01",
      },
    ],
    inspiration: [
      {
        id: 1,
        name: "Hailey Bieber",
        style: "Effortless street style with oversized blazers and bike shorts",
        image_url: "/hailey-bieber-street-style.jpg",
      },
      {
        id: 2,
        name: "Bella Hadid",
        style: "Y2K revival with low-rise jeans and crop tops",
        image_url: "/bella-hadid-y2k-fashion.jpg",
      },
      {
        id: 3,
        name: "Zendaya",
        style: "Bold patterns and statement pieces with confident silhouettes",
        image_url: "/zendaya-red-carpet-fashion.jpg",
      },
    ],
  },
]

export const mockMessages: Message[] = [
  // ALO messages
  {
    id: 1,
    customer_id: 1,
    store_id: 1,
    sender_type: "customer",
    message_text: "Hi! I'm interested in your new leggings collection.",
    created_at: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    customer_id: 1,
    store_id: 1,
    sender_type: "store",
    message_text: "Hello Sarah! We'd love to help you find the perfect pair. What style are you looking for?",
    created_at: "2024-01-10T10:05:00Z",
  },
  // NIKE messages
  {
    id: 3,
    customer_id: 1,
    store_id: 3,
    sender_type: "customer",
    message_text: "Do you have the Air Max 270 in white, size 8?",
    created_at: "2024-01-15T14:00:00Z",
  },
  {
    id: 4,
    customer_id: 1,
    store_id: 3,
    sender_type: "store",
    message_text: "Yes! We have that in stock. Would you like me to hold a pair for you?",
    created_at: "2024-01-15T14:05:00Z",
  },
  // VUORI messages
  {
    id: 5,
    customer_id: 1,
    store_id: 2,
    sender_type: "customer",
    message_text: "I love the Ponto pants! Any new colors coming soon?",
    created_at: "2024-02-01T16:00:00Z",
  },
  {
    id: 6,
    customer_id: 1,
    store_id: 2,
    sender_type: "store",
    message_text:
      "Great choice! We're launching sage green and dusty rose next week. I can notify you when they're available.",
    created_at: "2024-02-01T16:10:00Z",
  },
  // SKIMS conversation with fitting room appointment
  {
    id: 7,
    customer_id: 1,
    store_id: 4,
    sender_type: "customer",
    message_text:
      "Hi! I'm coming in at 1 PM today and want to try on the Cotton Rib Tank and Fits Everybody Bodysuit in size M.",
    created_at: "2024-02-05T11:30:00Z",
  },
  {
    id: 8,
    customer_id: 1,
    store_id: 4,
    sender_type: "store",
    message_text:
      "Perfect! We'll have fitting room 3 ready for you at 1 PM with both items in size M. I've also pulled some additional pieces you might like - the Cotton Jersey T-Shirt and Fits Everybody Square Neck Bra in similar tones. See you soon! 💕",
    created_at: "2024-02-05T11:35:00Z",
  },
  {
    id: 9,
    customer_id: 1,
    store_id: 4,
    sender_type: "customer",
    message_text: "Amazing, thank you! Can't wait to try everything on.",
    created_at: "2024-02-05T11:40:00Z",
  },
  // NEW BALANCE conversation with promotions and deals
  {
    id: 10,
    customer_id: 1,
    store_id: 5,
    sender_type: "store",
    message_text:
      "🔥 FLASH SALE ALERT! 25% off all Fresh Foam sneakers today only! Plus, as a Silver member, you get an additional 10% off. Use code: FRESHSTART25",
    created_at: "2024-02-06T09:00:00Z",
  },
  {
    id: 11,
    customer_id: 1,
    store_id: 5,
    sender_type: "customer",
    message_text: "This is perfect timing! I've been eyeing the Fresh Foam X 1080v12. Is it included in the sale?",
    created_at: "2024-02-06T09:15:00Z",
  },
  {
    id: 12,
    customer_id: 1,
    store_id: 5,
    sender_type: "store",
    message_text:
      "The 1080v12 is included. With your Silver member discount, you'll save 35% total. I'm coming in at 1 PM to try them on - can you have a pair ready in size 8?",
    created_at: "2024-02-06T09:20:00Z",
  },
  {
    id: 13,
    customer_id: 1,
    store_id: 5,
    sender_type: "customer",
    message_text: "Yes! I'm coming in at 1 PM to try them on - can you have a pair ready in size 8?",
    created_at: "2024-02-06T09:25:00Z",
  },
  {
    id: 14,
    customer_id: 1,
    store_id: 5,
    sender_type: "store",
    message_text:
      "Done! I'll have the Fresh Foam X 1080v12 in size 8 ready for you at 1 PM, along with some other Fresh Foam styles you might like. We'll also have your member pricing already applied. Looking forward to seeing you! 👟",
    created_at: "2024-02-06T09:30:00Z",
  },
]

export const storeInventory = {
  1: [
    // ALO
    {
      id: 1,
      name: "Shine High-Waist Leggings",
      image_url: "/black-athletic-leggings.jpg",
      price: 88,
      date_added: "2024-02-01",
      category: "Leggings",
    },
    {
      id: 2,
      name: "7/8 High-Waist Leggings",
      image_url: "/alo-yoga-leggings.jpg",
      price: 78,
      date_added: "2024-02-03",
      category: "Leggings",
    },
  ],
  2: [
    // VUORI
    {
      id: 3,
      name: "Ponto Performance Pant",
      image_url: "/gray-athletic-pants.jpg",
      price: 89,
      date_added: "2024-01-28",
      category: "Pants",
    },
  ],
  3: [
    // NIKE
    {
      id: 4,
      name: "Air Max 270",
      image_url: "/white-nike-sneakers.png",
      price: 150,
      date_added: "2024-01-25",
      category: "Sneakers",
    },
  ],
  4: [
    // SKIMS
    {
      id: 5,
      name: "Cotton Rib Tank",
      image_url: "/placeholder-zwhvp.png",
      price: 36,
      date_added: "2024-02-02",
      category: "Tops",
    },
  ],
  5: [
    // NEW BALANCE
    {
      id: 6,
      name: "Fresh Foam X 1080v12",
      image_url: "/placeholder-qt6ig.png",
      price: 165,
      date_added: "2024-01-30",
      category: "Running Shoes",
    },
  ],
}

export const tierPromotions = {
  bronze: [
    { id: 1, title: "Welcome Discount", description: "10% off first purchase", code: "WELCOME10" },
    { id: 2, title: "Birthday Special", description: "15% off during birthday month", code: "BIRTHDAY15" },
  ],
  silver: [
    { id: 3, title: "Silver Savings", description: "15% off all items", code: "SILVER15" },
    { id: 4, title: "Free Shipping", description: "Free shipping on orders over $75", code: "FREESHIP75" },
    { id: 5, title: "Early Access", description: "24-hour early access to sales", code: "EARLY24" },
  ],
  gold: [
    { id: 6, title: "Gold Standard", description: "20% off all items", code: "GOLD20" },
    { id: 7, title: "Free Returns", description: "Free returns and exchanges", code: "FREERETURN" },
    { id: 8, title: "Personal Stylist", description: "Complimentary styling session", code: "STYLIST" },
  ],
  vip: [
    { id: 9, title: "VIP Exclusive", description: "25% off all items", code: "VIP25" },
    { id: 10, title: "Concierge Service", description: "Personal shopping concierge", code: "CONCIERGE" },
    { id: 11, title: "Private Events", description: "Exclusive access to VIP events", code: "VIPEVENTS" },
    { id: 12, title: "Priority Support", description: "24/7 priority customer support", code: "PRIORITY24" },
  ],
}

export const customerAnalytics = {
  1: {
    // Sarah Chen
    total_spend: 1250,
    visit_frequency: "Weekly",
    last_visit: "2024-02-06",
    avg_order_value: 95,
    lifetime_purchases: 13,
    favorite_categories: ["Athleisure", "Sneakers", "Leggings"],
  },
}

// Helper functions for mock database operations
export function getCustomerById(id: number): Customer | undefined {
  return mockCustomers.find((customer) => customer.id === id)
}

export function getCustomersByStore(storeId: number): Customer[] {
  return mockCustomers.filter((customer) => customer.store_id === storeId)
}

export function getMessagesBetween(customerId: number, storeId: number): MessageWithSender[] {
  const customer = getCustomerById(customerId)
  const store = mockStores.find((s) => s.id === storeId)

  return mockMessages
    .filter((msg) => msg.customer_id === customerId && msg.store_id === storeId)
    .map((msg) => ({
      ...msg,
      sender_name: msg.sender_type === "customer" ? customer?.name || "Customer" : store?.name || "Store",
      customer_name: customer?.name,
      store_name: store?.name,
    }))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export function updateCustomerStatus(customerId: number, status: Customer["status"]): boolean {
  const customerIndex = mockCustomers.findIndex((c) => c.id === customerId)
  if (customerIndex !== -1) {
    mockCustomers[customerIndex].status = status
    return true
  }
  return false
}

export function addMessage(message: Omit<Message, "id" | "created_at">): Message {
  const newMessage: Message = {
    ...message,
    id: Math.max(...mockMessages.map((m) => m.id)) + 1,
    created_at: new Date().toISOString(),
  }
  mockMessages.push(newMessage)

  realtimeManager.broadcastMessage(newMessage)

  return newMessage
}

export function addImageMessage(message: Omit<Message, "id" | "created_at" | "message_text">): Message {
  const newMessage: Message = {
    ...message,
    message_text: undefined,
    id: Math.max(...mockMessages.map((m) => m.id)) + 1,
    created_at: new Date().toISOString(),
  }
  mockMessages.push(newMessage)

  realtimeManager.broadcastMessage(newMessage)

  return newMessage
}

export function getMessagesByCustomer(customerId: number): MessageWithSender[] {
  const customer = getCustomerById(customerId)

  return mockMessages
    .filter((msg) => msg.customer_id === customerId)
    .map((msg) => {
      const store = mockStores.find((s) => s.id === msg.store_id)
      return {
        ...msg,
        sender_name: msg.sender_type === "customer" ? customer?.name || "Customer" : store?.name || "Store",
        customer_name: customer?.name,
        store_name: store?.name,
      }
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getConversationThreads(customerId: number) {
  const customer = getCustomerById(customerId)
  if (!customer?.memberships) return []

  return customer.memberships.map((membership) => {
    const store = mockStores.find((s) => s.id === membership.store_id)
    const messages = getMessagesBetween(customerId, membership.store_id)
    const lastMessage = messages[messages.length - 1]

    return {
      store_id: membership.store_id,
      store_name: store?.name || "Unknown Store",
      status: membership.status,
      last_message: lastMessage?.message_text || "No messages yet",
      last_message_time: lastMessage?.created_at || "",
      unread_count: 0, // In a real app, this would be calculated
    }
  })
}

export function getStoreInventory(storeId: number) {
  return storeInventory[storeId] || []
}

export function getTierPromotions(tier: string) {
  return tierPromotions[tier] || []
}

export function getCustomerAnalytics(customerId: number) {
  return (
    customerAnalytics[customerId] || {
      total_spend: 0,
      visit_frequency: "New Customer",
      last_visit: "Never",
      avg_order_value: 0,
      lifetime_purchases: 0,
      favorite_categories: [],
    }
  )
}

export function createNewConversation(customerId: number, storeId: number): boolean {
  const customer = getCustomerById(customerId)
  const store = mockStores.find((s) => s.id === storeId)

  if (!customer || !store) return false

  // Check if customer already has membership with this store
  const existingMembership = customer.memberships?.find((m) => m.store_id === storeId)

  if (!existingMembership) {
    // Add new membership with bronze status
    if (!customer.memberships) customer.memberships = []
    customer.memberships.push({
      store_id: storeId,
      status: "bronze",
    })
  }

  return true
}
