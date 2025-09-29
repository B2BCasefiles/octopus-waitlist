'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
 
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (accessToken && refreshToken) {
          // Exchange the access token for a session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,  
            refresh_token: refreshToken,
          })

          if (error) {
            throw error
          }

          if (data.user) {
            // Check if email is confirmed before proceeding
            if (!data.user.email_confirmed_at) {
              setError('Please confirm your email address before continuing. Check your email for a confirmation link.');
              setLoading(false);
              return;
            }

            // Waitlist operations if needed
            const waitlistEmail = sessionStorage.getItem('waitlist_email')
            if (waitlistEmail) {
              try {
                const response = await fetch('/api/waitlist', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: data.user.id,
                    email: waitlistEmail,
                  }),
                })

                if (response.ok) {
                  sessionStorage.removeItem('waitlist_email')
                  toast.success('Successfully added to waitlist!')
                } else {
                  console.error('Waitlist API error:', await response.text())
                  toast.error('Could not add to waitlist, but your account is active.')
                }
              } catch (err) {
                console.error('Waitlist API error:', err)
                toast.error('Could not add to waitlist, but your account is active.')
              }
            }

            // Redirect to pricing page after successful authentication and confirmation
            router.push('/pricing')
          }
        } else {
          setError('Invalid authentication callback')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError(error.message || 'Authentication failed')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Completing Authentication...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Please wait while we complete your authentication.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => router.push('/signup')}
            >
              Return to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}