import Razorpay from 'razorpay'

// Only initialize Razorpay on the server side and when environment variables are available
export const razorpay = typeof window === 'undefined' && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  : null;
