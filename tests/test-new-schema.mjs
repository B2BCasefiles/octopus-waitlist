// Load environment variables first
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') })

// Now import the test suite
import { NewSchemaTestSuite } from './new-schema-test.js'

console.log('🚀 Testing New Supabase Schema Implementation...\n')
console.log('Environment variables loaded:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
})

const testSuite = new NewSchemaTestSuite()
testSuite.runAllTests().catch(console.error)