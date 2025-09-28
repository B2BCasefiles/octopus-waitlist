import { createRazorpayInstance } from '@/lib/razorpay/client'
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
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay environment variables are not configured properly.')
    }
    
    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      throw new Error('Razorpay client not initialized. Please check your configuration.')
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
    // Import crypto dynamically for server-side usage
    const crypto = (await import('crypto')).default;
    
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    if (!secret) {
      throw new Error('RAZORPAY_KEY_SECRET environment variable is not set');
    }
    
    const payload = paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    if (generated_signature === paymentData.razorpay_signature) {
      // Use admin client for server-side operations
      const adminSupabase = createAdminClient();
      
      // First, get the order to find the user_id
      const { data: orderData, error: orderError } = await adminSupabase
        .from('orders')
        .select('id, user_id, amount')
        .eq('razorpay_order_id', paymentData.razorpay_order_id)
        .single();
      
      if (orderError) {
        console.error('Error fetching order:', orderError);
        throw orderError;
      }
      
      if (!orderData) {
        throw new Error('Order not found');
      }
      
      // Update order status to paid atomically
      const { error: updateOrderError } = await adminSupabase
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', paymentData.razorpay_order_id);
      
      if (updateOrderError) {
        console.error('Error updating order status:', updateOrderError);
        throw updateOrderError;
      }
      
      // Insert payment record atomically
      const { data: paymentRecord, error: paymentError } = await adminSupabase
        .from('payments')
        .insert([{
          order_id: orderData.id,
          user_id: orderData.user_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          status: 'success',
          amount: orderData.amount,
          payment_method: 'razorpay',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (paymentError) {
        console.error('Error inserting payment record:', paymentError);
        throw paymentError;
      }
      
      // Update user profile to grant beta access atomically
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .update({ 
          beta_access: true,
          bought_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderData.user_id);
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        // If profile update fails, we should still consider payment successful
        // as the payment record is already inserted
        console.warn('Profile update failed, but payment was processed successfully');
      }
      
      return { verified: true, data: paymentRecord };
    } else {
      console.error('Signature verification failed', { 
        expected: generated_signature, 
        received: paymentData.razorpay_signature 
      });
      return { verified: false, error: 'Signature verification failed' };
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return { verified: false, error: error.message || 'Internal server error during payment verification' };
  }
};

// Client-side verification helper
export const verifyPayment = async (paymentData: any) => {
  try {
    // This would call your backend API for server-side verification
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    const result = await response.json();
    return { verified: result.success, data: result.data };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, error: error };
  }
};