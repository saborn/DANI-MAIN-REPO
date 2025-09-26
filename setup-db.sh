#!/bin/bash

# DANI Database Setup Script
echo "🚀 Setting up DANI Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "   Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first:"
    echo "   macOS: brew services start postgresql"
    echo "   Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed and running"

# Create database and user
echo "📊 Creating database and user..."
psql -c "CREATE DATABASE dani_messaging;" 2>/dev/null || echo "Database already exists"
psql -c "CREATE USER dani_user WITH PASSWORD 'dani_password';" 2>/dev/null || echo "User already exists"
psql -c "GRANT ALL PRIVILEGES ON DATABASE dani_messaging TO dani_user;" 2>/dev/null || echo "Privileges already granted"

echo "✅ Database and user created"

# Run schema and seed scripts
echo "📋 Creating tables..."
psql -U dani_user -d dani_messaging -f scripts/01-create-tables.sql

echo "🌱 Seeding database..."
psql -U dani_user -d dani_messaging -f scripts/02-seed-data.sql

echo "🎉 Database setup complete!"
echo ""
echo "You can now start the application with:"
echo "  npm run dev"
echo ""
echo "Database connection details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: dani_messaging"
echo "  User: dani_user"
echo "  Password: dani_password"
