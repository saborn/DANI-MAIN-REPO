#!/usr/bin/env node

import { testConnection, DatabaseService } from './lib/database'

async function initializeDatabase() {
  console.log('🚀 Initializing DANI Database...')
  
  try {
    // Test database connection
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ Failed to connect to database')
      process.exit(1)
    }

    console.log('✅ Database connection successful')
    
    // Test basic operations
    const stores = await DatabaseService.getAllStores()
    console.log(`📊 Found ${stores.length} stores in database`)
    
    const customers = await DatabaseService.getCustomerById(1)
    if (customers) {
      console.log(`👤 Found customer: ${customers.name}`)
    }
    
    console.log('🎉 Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
}

export { initializeDatabase }
