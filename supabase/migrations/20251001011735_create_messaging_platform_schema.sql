/*
  # Messaging Platform Schema

  ## Overview
  Complete database schema for a messaging platform connecting customers with businesses.
  Supports authentication, user profiles, memberships, real-time messaging, and purchase tracking.

  ## New Tables

  ### 1. `profiles`
  User authentication and account management table
  - `id` (uuid, primary key) - Links to Supabase auth.users
  - `email` (text, unique) - User email address
  - `user_type` (text) - Either 'customer' or 'business'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `customers`
  Customer profile information
  - `id` (uuid, primary key) - References profiles.id
  - `name` (text) - Customer full name
  - `phone` (text) - Customer phone number
  - `company` (text) - Customer's company name
  - `location` (text) - Customer's location
  - `notes` (text) - Additional profile notes
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 3. `businesses`
  Business profile information
  - `id` (uuid, primary key) - References profiles.id
  - `name` (text) - Business name
  - `description` (text) - Business description
  - `website` (text) - Business website URL
  - `phone` (text) - Business phone number
  - `logo_url` (text) - Business logo URL
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 4. `memberships`
  Customer memberships with businesses (loyalty tiers)
  - `id` (uuid, primary key) - Unique membership identifier
  - `customer_id` (uuid) - References customers.id
  - `business_id` (uuid) - References businesses.id
  - `status` (text) - Membership tier: bronze, silver, gold, or vip
  - `joined_at` (timestamptz) - Membership start date
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `conversations`
  Conversation threads between customers and businesses
  - `id` (uuid, primary key) - Unique conversation identifier
  - `customer_id` (uuid) - References customers.id
  - `business_id` (uuid) - References businesses.id
  - `created_at` (timestamptz) - Conversation start timestamp
  - `updated_at` (timestamptz) - Last message timestamp

  ### 6. `messages`
  Individual messages within conversations
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid) - References conversations.id
  - `sender_id` (uuid) - References profiles.id
  - `sender_type` (text) - Either 'customer' or 'business'
  - `message_text` (text) - Message content
  - `image_url` (text) - Optional image attachment
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Message sent timestamp

  ### 7. `purchases`
  Customer purchase history
  - `id` (uuid, primary key) - Unique purchase identifier
  - `customer_id` (uuid) - References customers.id
  - `business_id` (uuid) - References businesses.id
  - `item_name` (text) - Product/service name
  - `price` (numeric) - Purchase price
  - `image_url` (text) - Product image URL
  - `purchase_date` (date) - Date of purchase
  - `created_at` (timestamptz) - Record creation timestamp

  ### 8. `inspiration_items`
  Customer style inspiration references
  - `id` (uuid, primary key) - Unique item identifier
  - `customer_id` (uuid) - References customers.id
  - `name` (text) - Inspiration source name
  - `style` (text) - Style description
  - `image_url` (text) - Reference image URL
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  All tables have Row Level Security (RLS) enabled with the following policies:

  ### Profiles
  - Users can view their own profile
  - Users can update their own profile
  - Users can insert their own profile during registration

  ### Customers
  - Customers can view their own profile
  - Customers can update their own profile
  - Businesses can view customers they have conversations with

  ### Businesses
  - All authenticated users can view business profiles
  - Businesses can update their own profile

  ### Memberships
  - Customers can view their own memberships
  - Businesses can view memberships with their business
  - Customers can create memberships with any business

  ### Conversations
  - Users can view conversations they're part of
  - Customers can create conversations with any business

  ### Messages
  - Users can view messages in their conversations
  - Users can send messages in their conversations

  ### Purchases
  - Customers can view their own purchases
  - Businesses can view purchases from their business

  ### Inspiration Items
  - Customers can view and manage their own inspiration items

  ## Indexes
  - Conversations: indexed on customer_id and business_id for fast lookups
  - Messages: indexed on conversation_id for fast message retrieval
  - Memberships: indexed on customer_id and business_id
  - Purchases: indexed on customer_id and business_id
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (links to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('customer', 'business')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  company text,
  location text,
  notes text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  website text,
  phone text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'bronze' CHECK (status IN ('bronze', 'silver', 'gold', 'vip')),
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, business_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, business_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'business')),
  message_text text,
  image_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CHECK (message_text IS NOT NULL OR image_url IS NOT NULL)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image_url text,
  purchase_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create inspiration_items table
CREATE TABLE IF NOT EXISTS inspiration_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  style text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_memberships_customer ON memberships(customer_id);
CREATE INDEX IF NOT EXISTS idx_memberships_business ON memberships(business_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_business ON purchases(business_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Customers can insert own profile"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Businesses can view customers in conversations"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.customer_id = customers.id
      AND conversations.business_id = auth.uid()
    )
  );

-- Businesses policies
CREATE POLICY "Anyone can view business profiles"
  ON businesses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Businesses can update own profile"
  ON businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Businesses can insert own profile"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Memberships policies
CREATE POLICY "Customers can view own memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Businesses can view their memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Customers can create memberships"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Businesses can update membership status"
  ON memberships FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid() OR business_id = auth.uid());

CREATE POLICY "Customers can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Conversations can be updated by participants"
  ON conversations FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid() OR business_id = auth.uid())
  WITH CHECK (customer_id = auth.uid() OR business_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.customer_id = auth.uid() OR conversations.business_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.customer_id = auth.uid() OR conversations.business_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Purchases policies
CREATE POLICY "Customers can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Businesses can view their purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Businesses can insert purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

-- Inspiration items policies
CREATE POLICY "Customers can view own inspiration"
  ON inspiration_items FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can manage own inspiration"
  ON inspiration_items FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own inspiration"
  ON inspiration_items FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can delete own inspiration"
  ON inspiration_items FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
