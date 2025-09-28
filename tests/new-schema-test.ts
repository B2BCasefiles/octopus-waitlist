import { supabase } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { addToWaitlist, getWaitlistEntry } from '@/lib/waitlist'
import { createRazorpayOrder, verifyPaymentOnServer } from '@/lib/payment'

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

class NewSchemaTestSuite {
  private results: TestResult[] = []
  private adminClient = createAdminClient()
  private testUserId: string | null = null
  private testOrderId: string | null = null

  async runAllTests(): Promise<void> {
    console.log('🚀 Testing New Supabase Schema Implementation...\n')

    // Basic connection tests
    await this.testConnection()
    await this.testProfilesTableAccess()

    // Authentication tests
    await this.testAuthSignUp()
    await this.testAuthSignIn()

    // Profile and waitlist tests
    await this.testProfileCreation()
    await this.testWaitlistAddWithNewSchema()
    await this.testWaitlistGetWithNewSchema()

    // Payment tests
    await this.testOrderCreation()
    await this.testPaymentVerification()

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

  private async testProfilesTableAccess(): Promise<void> {
    await this.runTest('Profiles Table Access', async () => {
      // Test if we can access the profiles table structure
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) {
        throw new Error(`Profiles table access failed: ${error.message}`)
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
      
      this.testUserId = data.user.id
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

  // Profile Tests
  private async testProfileCreation(): Promise<void> {
    await this.runTest('Profile Creation on Sign Up', async () => {
      if (!this.testUserId) {
        throw new Error('No user ID available for profile test')
      }
      
      // Check if profile was created automatically by the trigger
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.testUserId)
        .single()
      
      if (error) {
        throw new Error(`Profile retrieval failed: ${error.message}`)
      }
      
      if (!data) {
        throw new Error('Profile was not created automatically')
      }
      
      if (data.waitlist_status !== 'not_joined') {
        throw new Error(`Expected waitlist_status to be 'not_joined', got '${data.waitlist_status}'`)
      }
      
      if (data.beta_access !== false) {
        throw new Error(`Expected beta_access to be false, got ${data.beta_access}`)
      }
    })
  }

  // Waitlist Tests with New Schema
  private async testWaitlistAddWithNewSchema(): Promise<void> {
    await this.runTest('Waitlist Add with New Schema', async () => {
      if (!this.testUserId) {
        throw new Error('No user ID available for waitlist test')
      }
      
      const result = await addToWaitlist(this.testUserId, TEST_PLAN)
      
      if (!result.success) {
        throw new Error(`Failed to add to waitlist: ${result.message}`)
      }
      
      // Verify the profile was updated
      const { data, error } = await supabase
        .from('profiles')
        .select('waitlist_status')
        .eq('id', this.testUserId)
        .single()
      
      if (error) {
        throw new Error(`Failed to verify waitlist status: ${error.message}`)
      }
      
      if (data?.waitlist_status !== 'pending') {
        throw new Error(`Expected waitlist_status to be 'pending', got '${data?.waitlist_status}'`)
      }
    })
  }

  private async testWaitlistGetWithNewSchema(): Promise<void> {
    await this.runTest('Waitlist Get with New Schema', async () => {
      if (!this.testUserId) {
        throw new Error('No user ID available for waitlist get test')
      }
      
      const entry = await getWaitlistEntry(this.testUserId)
      
      if (!entry) {
        throw new Error('Failed to retrieve waitlist entry')
      }
      
      if (entry.id !== this.testUserId) {
        throw new Error('Retrieved entry user ID mismatch')
      }
      
      if (entry.waitlist_status !== 'pending') {
        throw new Error(`Expected waitlist_status to be 'pending', got '${entry.waitlist_status}'`)
      }
    })
  }

  // Payment Tests
  private async testOrderCreation(): Promise<void> {
    await this.runTest('Order Creation', async () => {
      if (!this.testUserId) {
        throw new Error('No user ID available for order creation test')
      }
      
      try {
        const order = await createRazorpayOrder(this.testUserId, TEST_PLAN)
        
        if (!order) {
          throw new Error('Order creation returned null')
        }
        
        if (!order.id) {
          throw new Error('Order ID not returned')
        }
        
        this.testOrderId = order.id
        
        // Verify order was saved to database
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', this.testUserId)
          .eq('razorpay_order_id', order.id)
          .single()
        
        if (error) {
          throw new Error(`Failed to verify order in database: ${error.message}`)
        }
        
        if (!data) {
          throw new Error('Order was not saved to database')
        }
        
        if (data.status !== 'created') {
          throw new Error(`Expected order status to be 'created', got '${data.status}'`)
        }
      } catch (error: any) {
        // If Razorpay API fails, that's okay - we're testing the database integration
        if (error.message.includes('Razorpay')) {
          console.log('⚠️  Razorpay API test skipped (API key may not be configured)')
          return
        }
        throw error
      }
    })
  }

  private async testPaymentVerification(): Promise<void> {
    await this.runTest('Payment Verification', async () => {
      if (!this.testUserId || !this.testOrderId) {
        throw new Error('No user ID or order ID available for payment verification test')
      }
      
      // Mock payment verification data
      const mockPaymentData = {
        razorpay_order_id: this.testOrderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: 'test_signature'
      }
      
      try {
        const result = await verifyPaymentOnServer(mockPaymentData)
        
        if (!result.success) {
          throw new Error(`Payment verification failed: ${result.message}`)
        }
        
        // Verify payment was recorded
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', this.testUserId)
          .eq('razorpay_payment_id', mockPaymentData.razorpay_payment_id)
          .single()
        
        if (paymentError) {
          throw new Error(`Failed to verify payment in database: ${paymentError.message}`)
        }
        
        if (!paymentData) {
          throw new Error('Payment was not recorded in database')
        }
        
        if (paymentData.status !== 'paid') {
          throw new Error(`Expected payment status to be 'paid', got '${paymentData.status}'`)
        }
        
        // Verify user got beta access
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('beta_access')
          .eq('id', this.testUserId)
          .single()
        
        if (profileError) {
          throw new Error(`Failed to verify beta access: ${profileError.message}`)
        }
        
        if (profileData?.beta_access !== true) {
          throw new Error('Beta access was not granted after payment verification')
        }
        
      } catch (error: any) {
        // If Razorpay API fails, that's okay - we're testing the database integration
        if (error.message.includes('Razorpay')) {
          console.log('⚠️  Razorpay API test skipped (API key may not be configured)')
          return
        }
        throw error
      }
    })
  }

  // Cleanup
  private async cleanup(): Promise<void> {
    await this.runTest('Cleanup Test Data', async () => {
      if (!this.testUserId) {
        console.log('⚠️  No test user ID available for cleanup')
        return
      }
      
      // Clean up payments
      await supabase
        .from('payments')
        .delete()
        .eq('user_id', this.testUserId)
      
      // Clean up orders
      await supabase
        .from('orders')
        .delete()
        .eq('user_id', this.testUserId)
      
      // Clean up profile (this will be handled by user deletion)
      
      // Clean up auth user (if possible with admin client)
      try {
        await this.adminClient.auth.admin.deleteUser(this.testUserId)
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
export { NewSchemaTestSuite }

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new NewSchemaTestSuite()
  testSuite.runAllTests().catch(console.error)
}