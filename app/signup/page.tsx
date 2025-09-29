'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useSupabase() // Only using signUp, not signIn
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Track rate limiting state
  const [rateLimitError, setRateLimitError] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null)
  
  // Email confirmation dialog state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  
  // Minimum time between submissions to prevent spam
  const MIN_SUBMISSION_INTERVAL = 2000 // 2 seconds

  useEffect(() => {
    // Check for email in session storage (from waitlist form)
    const waitlistEmail = sessionStorage.getItem('waitlist_email')
    if (waitlistEmail) {
      setEmail(waitlistEmail)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    // Rate limiting check - prevent submissions within MIN_SUBMISSION_INTERVAL
    const now = Date.now()
    if (lastSubmissionTime && (now - lastSubmissionTime) < MIN_SUBMISSION_INTERVAL) {
      toast.error('Please wait before submitting again.')
      return
    }

    setIsLoading(true)
    // Don't update lastSubmissionTime here since we're already checking above
    setLastSubmissionTime(now)
    
    try {
      const { error, requiresConfirmation } = await signUp(email, password)
      if (error) {
        // Check for rate limiting error specifically
        if (error.includes('429') || error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('too many requests')) {
          setRateLimitError(true)
          toast.error('Too many requests. Please wait at least 30 seconds before trying again.')
        } else {
          toast.error(`Sign up failed: ${error}`)
        }
      } else {
        setRateLimitError(false)
        if (requiresConfirmation) {
          // Show the email confirmation dialog instead of redirecting
          setShowConfirmationDialog(true)
        } else {
          toast.success('Account created successfully!')
          // After sign up, redirect to pricing immediately for auto-confirmed accounts
          router.push('/pricing')
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      // Check if it's a rate limiting error
      if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('too many requests'))) {
        setRateLimitError(true)
        toast.error('Too many requests. Please wait at least 30 seconds before trying again.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black-purple p-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-8 shadow-xl shadow-purple-900/10">
        <CardHeader className="space-y-1 text-center p-0 mb-6">
          <CardTitle className="text-3xl font-display font-bold text-foreground mb-2">
            Sign Up
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Create an account to join our waitlist
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-0">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-0 pt-4">
            <button 
              className="w-full py-3 px-6 bg-gradient-purple text-white rounded-lg font-bold uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Processing...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
            <div className="text-center text-sm text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </div>
    </div>
  )
}