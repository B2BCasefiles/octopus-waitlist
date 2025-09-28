import { supabase } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { addToWaitlist, getWaitlistEntry } from '@/lib/waitlist'

// Test configuration
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPassword123!'
const TEST_PLAN = 'founder'

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

class SupabaseTestSuite {
  private results: TestResult[] = []
  private adminClient = createAdminClient()

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Supabase API Tests...\n')

    // Basic connection tests
    await this.testConnection()
    await this.testDatabaseAccess()

    // Waitlist functionality tests
    await this.testWaitlistAdd()
    await this.testWaitlistGet()
    await this.testWaitlistDuplicateHandling()

    // Authentication tests
    await this.testAuthSignUp()
    await this.testAuthSignIn()
    await this.testAuthSignOut()

    // Payment table tests
    await this.testPaymentTableAccess()
    await this.testPaymentInsert()

    // Cleanup
    await this.cleanup()

    // Print results
    this.printResults()
  }

  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now()
    try {
      await testFn()
      const duration = Date.now() - startTime
      this.results.push({ name, passed: true, duration })
      console.log(`✅ ${name} - ${duration}ms`)
    } catch (error: any) {
      const duration = Date.now() - startTime
      this.results.push({ name, passed: false, error: error.message, duration })
      console.log(`❌ ${name} - ${error.message} - ${duration}ms`)
    }
  }

  // Basic Connection Tests
  private async testConnection(): Promise<void> {
    await this.runTest('Supabase Client Connection', async () => {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }
      
      // Test basic connection by getting session
      const { data, error } = await supabase.auth.getSession()
      if (error && error.message !== 'Invalid JWT') {
        throw new Error(`Connection failed: ${error.message}`)
      }
    })
  }

  private async testDatabaseAccess(): Promise<void> {
    await this.runTest('Database Access Test', async () => {
      // Try to access waitlist table (should work even without auth due to RLS policy)
      const { error } = await supabase
        .from('waitlist')
        .select('count')
        .limit(1)
      
      if (error) {
        throw new Error(`Database access failed: ${error.message}`)
      }
    })
  }

  // Waitlist Tests
  private async testWaitlistAdd(): Promise<void> {
    await this.runTest('Waitlist Add Operation', async () => {
      const result = await addToWaitlist(TEST_EMAIL, TEST_PLAN)
      
      if (!result.success) {
        throw new Error(`Failed to add to waitlist: ${result.message}`)
      }
    })
  }

  private async testWaitlistGet(): Promise<void> {
    await this.runTest('Waitlist Get Operation', async () => {
      const entry = await getWaitlistEntry(TEST_EMAIL)
      
      if (!entry) {
        throw new Error('Failed to retrieve waitlist entry')
      }
      
      if (entry.email !== TEST_EMAIL || entry.plan !== TEST_PLAN) {
        throw new Error('Retrieved entry data mismatch')
      }
    })
  }

  private async testWaitlistDuplicateHandling(): Promise<void> {
    await this.runTest('Waitlist Duplicate Handling', async () => {
      // Try to add the same email again
      const result = await addToWaitlist(TEST_EMAIL, 'free')
      
      if (result.success) {
        throw new Error('Duplicate email was allowed (should be rejected)')
      }
      
      if (!result.message?.includes('already exists')) {
        throw new Error('Incorrect duplicate handling message')
      }
    })
  }

  // Authentication Tests
  private async testAuthSignUp(): Promise<void> {
    await this.runTest('Authentication Sign Up', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
      
      if (error) {
        throw new Error(`Sign up failed: ${error.message}`)
      }
      
      if (!data.user) {
        throw new Error('No user data returned from sign up')
      }
    })
  }

  private async testAuthSignIn(): Promise<void> {
    await this.runTest('Authentication Sign In', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
      
      if (error) {
        throw new Error(`Sign in failed: ${error.message}`)
      }
      
      if (!data.user) {
        throw new Error('No user data returned from sign in')
      }
    })
  }

  private async testAuthSignOut(): Promise<void> {
    await this.runTest('Authentication Sign Out', async () => {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(`Sign out failed: ${error.message}`)
      }
    })
  }

  // Payment Tests
  private async testPaymentTableAccess(): Promise<void> {
    await this.runTest('Payment Table Access', async () => {
      // Test if we can access the payments table structure
      const { error } = await supabase
        .from('payments')
        .select('count')
        .limit(1)
      
      if (error) {
        throw new Error(`Payment table access failed: ${error.message}`)
      }
    })
  }

  private async testPaymentInsert(): Promise<void> {
    await this.runTest('Payment Table Insert', async () => {
      const testOrderId = `test_order_${Date.now()}`
      
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          order_id: testOrderId,
          email: TEST_EMAIL,
          plan: TEST_PLAN,
          amount: 10.00,
          currency: 'INR',
          status: 'created'
        }])
        .select()
      
      if (error) {
        throw new Error(`Payment insert failed: ${error.message}`)
      }
      
      if (!data || data.length === 0) {
        throw new Error('No payment data returned from insert')
      }
    })
  }

  // Cleanup
  private async cleanup(): Promise<void> {
    await this.runTest('Cleanup Test Data', async () => {
      // Clean up waitlist entry
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', TEST_EMAIL)
      
      // Clean up payment entries
      await supabase
        .from('payments')
        .delete()
        .eq('email', TEST_EMAIL)
      
      // Clean up auth user (if possible with admin client)
      try {
        const { data: users } = await this.adminClient.auth.admin.listUsers()
        const testUser = users.users.find(user => user.email === TEST_EMAIL)
        
        if (testUser) {
          await this.adminClient.auth.admin.deleteUser(testUser.id)
        }
      } catch (error) {
        // Admin cleanup might fail if no admin access, that's okay
        console.log('⚠️  Could not clean up auth user (admin access required)')
      }
    })
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary:')
    console.log('=' .repeat(50))
    
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0)
    
    console.log(`Total Tests: ${this.results.length}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log(`Total Time: ${totalTime}ms`)
    console.log(`Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`))
    }
    
    console.log('\n' + (failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed'))
  }
}

// Export for use in other files
export { SupabaseTestSuite }

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new SupabaseTestSuite()
  testSuite.runAllTests().catch(console.error)
}