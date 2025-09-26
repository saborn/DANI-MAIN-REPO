# Environment Configuration Guide

To set up your environment variables, create a `.env.local` file in the root directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dani_messaging
DB_USER=dani_user
DB_PASSWORD=dani_password

# Redis Configuration (for real-time features)
REDIS_URL=redis://localhost:6379

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup Options

### Option 1: Using Docker (Recommended)
```bash
# Install Docker Desktop first, then:
npm run db:start
npm run db:init
```

### Option 2: Local PostgreSQL Installation
```bash
# Install PostgreSQL first, then:
./setup-db.sh
```

### Option 3: Manual Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE dani_messaging;`
3. Create user: `CREATE USER dani_user WITH PASSWORD 'dani_password';`
4. Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE dani_messaging TO dani_user;`
5. Run schema: `psql -U dani_user -d dani_messaging -f scripts/01-create-tables.sql`
6. Run seed: `psql -U dani_user -d dani_messaging -f scripts/02-seed-data.sql`
