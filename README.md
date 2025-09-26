# DANI - Personal Shopping Assistant

A luxury messaging system connecting VIP customers with brand concierges, built with Next.js 14 and PostgreSQL.

## 🚀 Features

- **Real-time Messaging**: Instant communication between customers and stores
- **VIP Customer Portal**: Exclusive shopping experience with personalized service
- **Brand Dashboard**: Store management interface for customer relationships
- **Authentication System**: Secure login/signup for both customers and stores
- **Database Integration**: PostgreSQL with comprehensive data models
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with connection pooling
- **Real-time**: Custom real-time messaging system
- **Authentication**: JWT-based authentication
- **Deployment**: Docker-ready with docker-compose

## 📋 Prerequisites

Before running the application, you need:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v13 or higher) - OR Docker with Docker Compose
3. **npm** or **yarn** package manager

## 🗄️ Database Setup

### Option 1: Using Docker (Recommended)

1. **Install Docker Desktop**:
   - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
   - Install and start Docker Desktop

2. **Start the database**:
   ```bash
   npm run db:start
   ```

3. **Initialize the database**:
   ```bash
   npm run db:init
   ```

### Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create database and user**:
   ```sql
   CREATE DATABASE dani_messaging;
   CREATE USER dani_user WITH PASSWORD 'dani_password';
   GRANT ALL PRIVILEGES ON DATABASE dani_messaging TO dani_user;
   ```

3. **Run the schema and seed scripts**:
   ```bash
   psql -U dani_user -d dani_messaging -f scripts/01-create-tables.sql
   psql -U dani_user -d dani_messaging -f scripts/02-seed-data.sql
   ```

## 🚀 Getting Started

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd messaging-system
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dani_messaging
   DB_USER=dani_user
   DB_PASSWORD=dani_password
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start the database** (if using Docker):
   ```bash
   npm run db:start
   ```

4. **Initialize the database**:
   ```bash
   npm run db:init
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following tables:

- **stores**: Brand/store information
- **customers**: Customer profiles and details
- **memberships**: Many-to-many relationship between customers and stores
- **messages**: Real-time messaging data
- **purchases**: Customer purchase history
- **user_profiles**: Authentication and user management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:start` - Start PostgreSQL with Docker
- `npm run db:stop` - Stop Docker containers
- `npm run db:reset` - Reset database (removes all data)
- `npm run db:init` - Initialize and test database connection
- `npm run db:seed` - Re-seed database with sample data

## 🎯 API Endpoints

### Customer API
- `GET /api/customer/conversations` - Get customer's conversation threads
- `GET /api/customer/messages/[conversationId]` - Get messages for a conversation
- `POST /api/customer/messages/[conversationId]` - Send a new message
- `GET /api/customer/profile` - Get customer profile and analytics

### Store API (Coming Soon)
- `GET /api/store/customers` - Get store's customers
- `GET /api/store/messages/[customerId]` - Get messages with a customer
- `POST /api/store/messages/[customerId]` - Send message to customer

## 🧪 Testing the Application

1. **Access the homepage**: [http://localhost:3000](http://localhost:3000)
2. **Test Customer Flow**:
   - Click "Enter VIP Portal"
   - Sign up as a customer
   - Access messaging interface
3. **Test Store Flow**:
   - Click "Enter Brand Portal"
   - Sign up as a store
   - Access customer dashboard

## 📱 Sample Data

The database comes pre-seeded with:

- **8 Luxury Brands**: ALO, VUORI, NIKE, SKIMS, NEW BALANCE, LEVI, BANANA REPUBLIC, GAP
- **4 Sample Customers**: Sarah Chen (VIP), Emma Johnson (Silver), Michael Brown (Bronze), Lisa Davis (VIP)
- **Realistic Conversations**: Multiple message threads with different stores
- **Purchase History**: Sample transactions with images
- **Membership Tiers**: Different status levels with promotions

## 🔒 Authentication

The application uses JWT-based authentication with:
- Secure password hashing with bcrypt
- Session management
- Protected routes
- Role-based access (customer vs store)

## 🚀 Deployment

### Using Docker

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

### Using Vercel/Netlify

1. **Set up environment variables** in your deployment platform
2. **Connect to a managed PostgreSQL database** (e.g., Supabase, PlanetScale, or AWS RDS)
3. **Deploy the application**

## 🛠️ Development

### Database Connection

The application uses a connection pool for optimal performance:

```typescript
import { DatabaseService } from '@/lib/database'

// Get customer by ID
const customer = await DatabaseService.getCustomerById(1)

// Add a new message
const message = await DatabaseService.addMessage({
  customer_id: 1,
  store_id: 1,
  sender_type: 'customer',
  message_text: 'Hello!',
  is_read: false
})
```

### Adding New Features

1. **Database Changes**: Update the schema in `scripts/01-create-tables.sql`
2. **API Routes**: Add new endpoints in `app/api/`
3. **Database Service**: Add new methods in `lib/database.ts`
4. **Frontend**: Update components in `app/` and `components/`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for luxury shopping experiences**
