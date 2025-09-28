'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-2xl font-bold text-foreground">Payment Failed</div>
        <div className="text-destructive">❌</div>
        <p className="text-muted-foreground">
          Your payment could not be processed. Please try again or contact support.
        </p>
        <div className="pt-4">
          <Link href="/pricing">
            <Button>Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}