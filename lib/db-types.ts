export interface Store {
  id: number
  name: string
  email: string
  created_at: string
  avatar_url?: string
  description?: string
  website?: string
  phone?: string
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  status: "bronze" | "silver" | "gold" | "vip"
  store_id: number
  created_at: string
  avatar_url?: string
  company?: string
  location?: string
  notes?: string
}

export interface Message {
  id: number
  customer_id: number
  store_id: number
  sender_type: "customer" | "store"
  message_text?: string
  image_url?: string
  created_at: string
}

export interface MessageWithSender extends Message {
  sender_name: string
  customer_name?: string
}
