import { supabaseBrowser } from "./supabaseClient"

export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  location?: string
  notes?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface BusinessProfile {
  id: string
  name: string
  email: string
  description?: string
  website?: string
  phone?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  customer_id: string
  business_id: string
  status: "bronze" | "silver" | "gold" | "vip"
  joined_at: string
  business?: BusinessProfile
}

export interface Conversation {
  id: string
  customer_id: string
  business_id: string
  created_at: string
  updated_at: string
  customer?: CustomerProfile
  business?: BusinessProfile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: "customer" | "business"
  message_text?: string
  image_url?: string
  is_read: boolean
  created_at: string
}

export interface Purchase {
  id: string
  customer_id: string
  business_id: string
  item_name: string
  price: number
  image_url?: string
  purchase_date: string
  created_at: string
}

export const supabaseDb = {
  async getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
    const { data: profile } = await supabaseBrowser
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle()

    if (!profile) return null

    const { data: customer } = await supabaseBrowser
      .from("customers")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (!customer) return null

    return {
      ...customer,
      email: profile.email,
    }
  },

  async updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): Promise<boolean> {
    const { error } = await supabaseBrowser.from("customers").update(updates).eq("id", userId)

    return !error
  },

  async getBusinessProfile(userId: string): Promise<BusinessProfile | null> {
    const { data: profile } = await supabaseBrowser
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle()

    if (!profile) return null

    const { data: business } = await supabaseBrowser
      .from("businesses")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (!business) return null

    return {
      ...business,
      email: profile.email,
    }
  },

  async updateBusinessProfile(userId: string, updates: Partial<BusinessProfile>): Promise<boolean> {
    const { error } = await supabaseBrowser.from("businesses").update(updates).eq("id", userId)

    return !error
  },

  async getAllBusinesses(): Promise<BusinessProfile[]> {
    const { data: businesses } = await supabaseBrowser.from("businesses").select("*, profiles!inner(email)")

    if (!businesses) return []

    return businesses.map((b: any) => ({
      id: b.id,
      name: b.name,
      email: b.profiles.email,
      description: b.description,
      website: b.website,
      phone: b.phone,
      logo_url: b.logo_url,
      created_at: b.created_at,
      updated_at: b.updated_at,
    }))
  },

  async getCustomerMemberships(customerId: string): Promise<Membership[]> {
    const { data: memberships } = await supabaseBrowser
      .from("memberships")
      .select("*, businesses(*, profiles!inner(email))")
      .eq("customer_id", customerId)

    if (!memberships) return []

    return memberships.map((m: any) => ({
      id: m.id,
      customer_id: m.customer_id,
      business_id: m.business_id,
      status: m.status,
      joined_at: m.joined_at,
      business: m.businesses
        ? {
            id: m.businesses.id,
            name: m.businesses.name,
            email: m.businesses.profiles.email,
            description: m.businesses.description,
            website: m.businesses.website,
            phone: m.businesses.phone,
            logo_url: m.businesses.logo_url,
            created_at: m.businesses.created_at,
            updated_at: m.businesses.updated_at,
          }
        : undefined,
    }))
  },

  async createMembership(customerId: string, businessId: string): Promise<Membership | null> {
    const { data: existing } = await supabaseBrowser
      .from("memberships")
      .select("*")
      .eq("customer_id", customerId)
      .eq("business_id", businessId)
      .maybeSingle()

    if (existing) return existing

    const { data: membership } = await supabaseBrowser
      .from("memberships")
      .insert({
        customer_id: customerId,
        business_id: businessId,
        status: "bronze",
      })
      .select()
      .single()

    return membership
  },

  async getOrCreateConversation(customerId: string, businessId: string): Promise<Conversation | null> {
    const { data: existing } = await supabaseBrowser
      .from("conversations")
      .select("*")
      .eq("customer_id", customerId)
      .eq("business_id", businessId)
      .maybeSingle()

    if (existing) return existing

    const { data: conversation } = await supabaseBrowser
      .from("conversations")
      .insert({
        customer_id: customerId,
        business_id: businessId,
      })
      .select()
      .single()

    return conversation
  },

  async getConversationsForCustomer(customerId: string): Promise<Conversation[]> {
    const { data: conversations } = await supabaseBrowser
      .from("conversations")
      .select("*, businesses(*, profiles!inner(email))")
      .eq("customer_id", customerId)
      .order("updated_at", { ascending: false })

    if (!conversations) return []

    return conversations.map((c: any) => ({
      id: c.id,
      customer_id: c.customer_id,
      business_id: c.business_id,
      created_at: c.created_at,
      updated_at: c.updated_at,
      business: c.businesses
        ? {
            id: c.businesses.id,
            name: c.businesses.name,
            email: c.businesses.profiles.email,
            description: c.businesses.description,
            website: c.businesses.website,
            phone: c.businesses.phone,
            logo_url: c.businesses.logo_url,
            created_at: c.businesses.created_at,
            updated_at: c.businesses.updated_at,
          }
        : undefined,
    }))
  },

  async getConversationsForBusiness(businessId: string): Promise<Conversation[]> {
    const { data: conversations } = await supabaseBrowser
      .from("conversations")
      .select("*, customers(*, profiles!inner(email))")
      .eq("business_id", businessId)
      .order("updated_at", { ascending: false })

    if (!conversations) return []

    return conversations.map((c: any) => ({
      id: c.id,
      customer_id: c.customer_id,
      business_id: c.business_id,
      created_at: c.created_at,
      updated_at: c.updated_at,
      customer: c.customers
        ? {
            id: c.customers.id,
            name: c.customers.name,
            email: c.customers.profiles.email,
            phone: c.customers.phone,
            company: c.customers.company,
            location: c.customers.location,
            notes: c.customers.notes,
            avatar_url: c.customers.avatar_url,
            created_at: c.customers.created_at,
            updated_at: c.customers.updated_at,
          }
        : undefined,
    }))
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data: messages } = await supabaseBrowser
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    return messages || []
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    senderType: "customer" | "business",
    messageText?: string,
    imageUrl?: string,
  ): Promise<Message | null> {
    const { data: message } = await supabaseBrowser
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: senderType,
        message_text: messageText,
        image_url: imageUrl,
        is_read: false,
      })
      .select()
      .single()

    if (message) {
      await supabaseBrowser.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)
    }

    return message
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await supabaseBrowser
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
  },

  async getPurchases(customerId: string): Promise<Purchase[]> {
    const { data: purchases } = await supabaseBrowser
      .from("purchases")
      .select("*")
      .eq("customer_id", customerId)
      .order("purchase_date", { ascending: false })

    return purchases || []
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const channel = supabaseBrowser
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as Message)
        },
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  },
}
