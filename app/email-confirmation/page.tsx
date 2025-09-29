'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function EmailConfirmationPage() {
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = () => {
    setIsResending(true)
    // Add logic here to resend confirmation email if needed
    // This would typically be an API call to your backend
    setTimeout(() => {
      setIsResending(false)
      alert('Confirmation email has been resent! Please check your inbox.')
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black-purple p-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-8 shadow-xl shadow-purple-900/10">
        <CardHeader className="space-y-1 text-center p-0 mb-6">
          <CardTitle className="text-2xl font-display font-bold text-foreground mb-2">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.
            </p>
            <p className="mb-6">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-gradient-purple text-white rounded-lg font-bold uppercase transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}