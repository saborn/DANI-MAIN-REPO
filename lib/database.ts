import { Pool } from 'pg'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dani_messaging',
  user: process.env.DB_USER || 'dani_user',
  password: process.env.DB_PASSWORD || 'dani_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

// Create connection pool
export const pool = new Pool(dbConfig)

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('Database connected successfully:', result.rows[0])
    client.release()
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Database types
export interface Store {
  id: number
  name: string
  email: string
  description?: string
  website?: string
  phone?: string
  logo_url?: string
  created_at: Date
  updated_at: Date
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  status: 'bronze' | 'silver' | 'gold' | 'vip'
  company?: string
  location?: string
  notes?: string
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

export interface Membership {
  id: number
  customer_id: number
  store_id: number
  status: 'bronze' | 'silver' | 'gold' | 'vip'
  joined_at: Date
}

export interface Message {
  id: number
  customer_id: number
  store_id: number
  sender_type: 'customer' | 'store'
  message_text?: string
  image_url?: string
  is_read: boolean
  created_at: Date
  updated_at: Date
}

export interface MessageWithSender extends Message {
  sender_name: string
  customer_name?: string
  store_name?: string
}

export interface Purchase {
  id: number
  customer_id: number
  store_id: number
  item_name: string
  price: number
  image_url?: string
  purchase_date: Date
  created_at: Date
}

export interface UserProfile {
  id: number
  email: string
  password_hash: string
  user_type: 'customer' | 'store'
  customer_id?: number
  store_id?: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// Database query functions
export class DatabaseService {
  // Store operations
  static async getStoreById(id: number): Promise<Store | null> {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id])
    return result.rows[0] || null
  }

  static async getAllStores(): Promise<Store[]> {
    const result = await pool.query('SELECT * FROM stores ORDER BY name')
    return result.rows
  }

  // Customer operations
  static async getCustomerById(id: number): Promise<Customer | null> {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id])
    return result.rows[0] || null
  }

  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email])
    return result.rows[0] || null
  }

  static async getCustomersByStore(storeId: number): Promise<Customer[]> {
    const result = await pool.query(`
      SELECT DISTINCT c.*, m.status as membership_status
      FROM customers c
      JOIN memberships m ON c.id = m.customer_id
      WHERE m.store_id = $1
      ORDER BY c.name
    `, [storeId])
    return result.rows
  }

  // Membership operations
  static async getMembershipsByCustomer(customerId: number): Promise<Membership[]> {
    const result = await pool.query(`
      SELECT m.*, s.name as store_name
      FROM memberships m
      JOIN stores s ON m.store_id = s.id
      WHERE m.customer_id = $1
      ORDER BY s.name
    `, [customerId])
    return result.rows
  }

  static async createMembership(customerId: number, storeId: number, status: string = 'bronze'): Promise<Membership> {
    const result = await pool.query(`
      INSERT INTO memberships (customer_id, store_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [customerId, storeId, status])
    return result.rows[0]
  }

  // Message operations
  static async getMessagesBetween(customerId: number, storeId: number): Promise<MessageWithSender[]> {
    const result = await pool.query(`
      SELECT m.*, 
             CASE 
               WHEN m.sender_type = 'customer' THEN c.name
               ELSE s.name
             END as sender_name,
             c.name as customer_name,
             s.name as store_name
      FROM messages m
      JOIN customers c ON m.customer_id = c.id
      JOIN stores s ON m.store_id = s.id
      WHERE m.customer_id = $1 AND m.store_id = $2
      ORDER BY m.created_at ASC
    `, [customerId, storeId])
    return result.rows
  }

  static async addMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> {
    const result = await pool.query(`
      INSERT INTO messages (customer_id, store_id, sender_type, message_text, image_url, is_read)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [message.customer_id, message.store_id, message.sender_type, message.message_text, message.image_url, message.is_read])
    return result.rows[0]
  }

  static async markMessagesAsRead(customerId: number, storeId: number): Promise<void> {
    await pool.query(`
      UPDATE messages 
      SET is_read = true 
      WHERE customer_id = $1 AND store_id = $2 AND sender_type = 'store'
    `, [customerId, storeId])
  }

  // Purchase operations
  static async getPurchasesByCustomer(customerId: number): Promise<Purchase[]> {
    const result = await pool.query(`
      SELECT p.*, s.name as store_name
      FROM purchases p
      JOIN stores s ON p.store_id = s.id
      WHERE p.customer_id = $1
      ORDER BY p.purchase_date DESC
    `, [customerId])
    return result.rows
  }

  static async addPurchase(purchase: Omit<Purchase, 'id' | 'created_at'>): Promise<Purchase> {
    const result = await pool.query(`
      INSERT INTO purchases (customer_id, store_id, item_name, price, image_url, purchase_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [purchase.customer_id, purchase.store_id, purchase.item_name, purchase.price, purchase.image_url, purchase.purchase_date])
    return result.rows[0]
  }

  // User profile operations
  static async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const result = await pool.query('SELECT * FROM user_profiles WHERE email = $1', [email])
    return result.rows[0] || null
  }

  static async createUserProfile(userProfile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const result = await pool.query(`
      INSERT INTO user_profiles (email, password_hash, user_type, customer_id, store_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userProfile.email, userProfile.password_hash, userProfile.user_type, userProfile.customer_id, userProfile.store_id, userProfile.is_active])
    return result.rows[0]
  }

  // Analytics operations
  static async getCustomerAnalytics(customerId: number): Promise<any> {
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(p.price), 0) as total_spend,
        COUNT(p.id) as lifetime_purchases,
        COALESCE(AVG(p.price), 0) as avg_order_value,
        MAX(p.purchase_date) as last_visit
      FROM purchases p
      WHERE p.customer_id = $1
    `, [customerId])
    
    return result.rows[0] || {
      total_spend: 0,
      lifetime_purchases: 0,
      avg_order_value: 0,
      last_visit: null
    }
  }
}
