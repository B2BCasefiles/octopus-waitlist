import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') })

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export class NewSchemaTestSuite {
  private supabase: any
  private supabaseAdmin: any
  private testUserEmail: string = 'test-' + Date.now() + '@example.com'
  private testUserPassword: string = 'testpassword123'
  private testUserId: string = ''
  private testOrderId: string = ''

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  }

  async runAllTests() {
    try {
      console.log('🧪 Starting New Schema Test Suite...\n')
      
      // Run tests in sequence
      await this.testSupabaseConnection()
      await this.testAuthentication()
      await this.testProfilesTable()
      await this.testWaitlistFunctionality()
      await this.testPaymentFlow()
      await this.testCleanup()
      
      console.log('\n✅ All tests passed successfully!')
    } catch (error) {
      console.error('\n❌ Test suite failed:', error)
      throw error
    }
  }

  async testSupabaseConnection() {
    console.log('1️⃣ Testing Supabase Connection...')
    
    // Test connection to profiles table
    const { data, error } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      throw new Error(`Failed to connect to profiles table: ${error.message}`)
    }
    
    console.log('   ✅ Supabase connection successful')
  }

  async testAuthentication() {
    console.log('2️⃣ Testing Authentication...')
    
    // Sign up new user
    const { data: signUpData, error: signUpError } = await this.supabase.auth.signUp({
      email: this.testUserEmail,
      password: this.testUserPassword,
    })
    
    if (signUpError) {
      throw new Error(`Failed to sign up: ${signUpError.message}`)
    }
    
    this.testUserId = signUpData.user?.id || ''
    console.log('   ✅ User signed up successfully:', this.testUserId)
    
    // Sign in the user
    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: this.testUserEmail,
      password: this.testUserPassword,
    })
    
    if (signInError) {
      throw new Error(`Failed to sign in: ${signInError.message}`)
    }
    
    console.log('   ✅ User signed in successfully')
  }

  async testProfilesTable() {
    console.log('3️⃣ Testing Profiles Table...')
    
    // Check if profile was created automatically via trigger
    const { data: profile, error: profileError } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', this.testUserId)
      .single()
    
    if (profileError || !profile) {
      throw new Error(`Profile not found: ${profileError?.message}`)
    }
    
    console.log('   ✅ Profile created automatically:', {
      id: profile.id,
      email: profile.email,
      waitlist_status: profile.waitlist_status,
      beta_access: profile.beta_access,
      created_at: profile.created_at
    })
  }

  async testWaitlistFunctionality() {
    console.log('4️⃣ Testing Waitlist Functionality...')
    
    // Add user to waitlist (should update profile)
    const { error: waitlistError } = await this.supabaseAdmin
      .from('profiles')
      .update({ waitlist_status: 'pending' })
      .eq('id', this.testUserId)
    
    if (waitlistError) {
      throw new Error(`Failed to add to waitlist: ${waitlistError.message}`)
    }
    
    console.log('   ✅ User added to waitlist')
    
    // Get waitlist entry
    const { data: profile, error: getError } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', this.testUserId)
      .single()
    
    if (getError || !profile) {
      throw new Error(`Failed to get waitlist entry: ${getError?.message}`)
    }
    
    if (profile.waitlist_status !== 'pending') {
      throw new Error(`Waitlist status not updated correctly: ${profile.waitlist_status}`)
    }
    
    console.log('   ✅ Waitlist entry retrieved:', profile.waitlist_status)
  }

  async testPaymentFlow() {
    console.log('5️⃣ Testing Payment Flow...')
    
    // Create an order
    const orderData = {
      user_id: this.testUserId,
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      razorpay_order_id: 'test_order_' + Date.now(),
      status: 'created' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: order, error: orderError } = await this.supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`)
    }
    
    this.testOrderId = order.id
    console.log('   ✅ Order created:', this.testOrderId)
    
    // Simulate payment verification
    const paymentData = {
      order_id: this.testOrderId,
      user_id: this.testUserId,
      razorpay_payment_id: 'test_payment_' + Date.now(),
      razorpay_order_id: orderData.razorpay_order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      status: 'captured' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { error: paymentError } = await this.supabaseAdmin
      .from('payments')
      .insert(paymentData)
    
    if (paymentError) {
      throw new Error(`Failed to create payment: ${paymentError.message}`)
    }
    
    console.log('   ✅ Payment recorded')
    
    // Update order status and grant beta access
    const { error: updateError } = await this.supabaseAdmin
      .from('orders')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', this.testOrderId)
    
    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`)
    }
    
    const { error: profileUpdateError } = await this.supabaseAdmin
      .from('profiles')
      .update({ 
        beta_access: true,
        bought_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.testUserId)
    
    if (profileUpdateError) {
      throw new Error(`Failed to grant beta access: ${profileUpdateError.message}`)
    }
    
    console.log('   ✅ Order updated and beta access granted')
    
    // Verify final state
    const { data: finalProfile, error: finalError } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', this.testUserId)
      .single()
    
    if (finalError || !finalProfile) {
      throw new Error(`Failed to verify final state: ${finalError?.message}`)
    }
    
    if (!finalProfile.beta_access) {
      throw new Error('Beta access not granted correctly')
    }
    
    console.log('   ✅ Final state verified - User has beta access')
  }

  async testCleanup() {
    console.log('6️⃣ Cleaning up test data...')
    
    // Delete test data in correct order (payments -> orders -> profiles -> auth)
    await this.supabaseAdmin
      .from('payments')
      .delete()
      .eq('user_id', this.testUserId)
    
    await this.supabaseAdmin
      .from('orders')
      .delete()
      .eq('user_id', this.testUserId)
    
    await this.supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', this.testUserId)
    
    // Delete auth user
    const { error: authError } = await this.supabaseAdmin.auth.admin.deleteUser(this.testUserId)
    if (authError) {
      console.log('   ⚠️  Warning: Could not delete auth user:', authError.message)
    }
    
    console.log('   ✅ Test data cleaned up')
  }
}