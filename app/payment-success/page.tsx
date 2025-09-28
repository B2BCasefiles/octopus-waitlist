'use client'

import { useEffect } from 'react'
import { verifyPayment } from '@/lib/payment'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Extract payment data from URL or state
      // In a real implementation, you'd get this from query params or state
      const paymentData = {
        razorpay_order_id: params.order_id as string,
        razorpay_payment_id: params.payment_id as string,
        razorpay_signature: params.signature as string,
      }

      // Verify the payment
      const result = await verifyPayment(paymentData)
      
      if (result.verified) {
        toast.success('Payment successful! Access activated.')
        // Redirect to dashboard or appropriate page
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        toast.error(result.error || 'Payment verification failed')
        router.push('/pricing')
      }
    }

    // Only run if we have payment data
    if (params.order_id && params.payment_id && params.signature) {
      handlePaymentSuccess()
    }
  }, [params, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-2xl font-bold text-foreground">Processing Payment...</div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  )
}