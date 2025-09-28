import { razorpay } from '@/lib/razorpay/client'
import { supabase } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'

export interface PaymentData {
  id: string
  order_id: string
  user_id: string
  razorpay_payment_id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

export const createRazorpayOrder = async (amount: number, userId: string) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay client not initialized. Please check your environment variables.')
    }
    
    // Create order in Razorpay
    const options = {
      amount: Math.round(amount * 100), // Amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: `order_${Date.now()}_${userId}`,
    }
    
    const order = await razorpay.orders.create(options)
    
    // Store order in Supabase orders table
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        razorpay_order_id: order.id,
        amount: Math.round(amount * 100), // Store amount in paise
        currency: 'INR',
        status: 'created'
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return {
      orderId: order.id,
      amount: order.amount, // This will be in paise
      currency: order.currency
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Client-side verification helper (signature verification should happen on backend in production)
export const verifyPaymentSignature = (order_id: string, payment_id: string, signature: string) => {
  // In a real application, signature verification should happen on your backend
  // This is just a client-side helper that would call your backend API
  return fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature,
    }),
  })
}

// Server-side verification function (this would be used in an API route)
export const verifyPaymentOnServer = async (paymentData: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}) => {
  try {
    // In a real application, you would use crypto from Node.js
    // For client-side purposes, we'll defer to a backend API
    const crypto = require('crypto')
    
    const secret = process.env.RAZORPAY_KEY_SECRET!
    
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id)
      .digest('hex')
    
    if (generated_signature === paymentData.razorpay_signature) {
      // Use admin client for server-side operations
      const adminSupabase = createAdminClient()
      
      // First, get the order to find the user_id
      const { data: orderData, error: orderError } = await adminSupabase
        .from('orders')
        .select('id, user_id, amount')
        .eq('razorpay_order_id', paymentData.razorpay_order_id)
        .single()
      
      if (orderError) throw orderError
      
      // Update order status to paid
      const { error: updateOrderError } = await adminSupabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('razorpay_order_id', paymentData.razorpay_order_id)
      
      if (updateOrderError) throw updateOrderError
      
      // Insert payment record
      const { data: paymentRecord, error: paymentError } = await adminSupabase
        .from('payments')
        .insert([{
          order_id: orderData.id,
          user_id: orderData.user_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          status: 'success',
          amount: orderData.amount,
          payment_method: 'razorpay'
        }])
        .select()
        .single()
      
      if (paymentError) throw paymentError
      
      // Update user profile to grant beta access
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .update({ 
          beta_access: true,
          bought_at: new Date().toISOString()
        })
        .eq('id', orderData.user_id)
      
      if (profileError) throw profileError
      
      return { verified: true, data: paymentRecord }
    } else {
      return { verified: false, error: 'Signature verification failed' }
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return { verified: false, error: error.message }
  }
}