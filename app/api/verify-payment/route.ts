import { NextRequest } from 'next/server'
import { verifyPaymentOnServer } from '@/lib/payment'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ success: false, error: 'Missing required fields for payment verification' }, { status: 400 })
    }
    
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id })
    
    const result = await verifyPaymentOnServer({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })
    
    if (result.verified) {
      console.log('Payment verified successfully:', result.data)
      return Response.json({ success: true, data: result.data }, { status: 200 })
    } else {
      console.error('Payment verification failed:', result.error)
      return Response.json({ success: false, error: result.error || 'Payment verification failed' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Payment verification API error:', error)
    return Response.json({ success: false, error: error.message || 'Internal server error during payment verification' }, { status: 500 })
  }
}