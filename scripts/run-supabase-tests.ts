#!/usr/bin/env tsx

import { SupabaseTestSuite } from '../tests/supabase-test'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function main() {
  console.log('🔧 Supabase API Test Runner')
  console.log('=' .repeat(40))
  
  // Check required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => console.error(`  - ${varName}`))
    console.error('\nPlease check your .env.local file.')
    process.exit(1)
  }
  
  console.log('✅ Environment variables loaded')
  console.log(`📍 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log('')
  
  try {
    const testSuite = new SupabaseTestSuite()
    await testSuite.runAllTests()
    
    console.log('\n✨ Test execution completed!')
  } catch (error) {
    console.error('\n💥 Test execution failed:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run the main function
main().catch(console.error)