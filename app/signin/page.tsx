'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      if (isSignUp) {
        const { error, requiresConfirmation } = await signUp(email, password)
        if (error) {
          toast.error(`Sign up failed: ${error}`)
        } else {
          if (requiresConfirmation) {
            toast.success('Please check your email to confirm your account!')
          } else {
            toast.success('Account created successfully!')
          }
          // After sign up, redirect to pricing immediately
          router.push('/pricing')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(`Sign in failed: ${error}`)
        } else {
          toast.success('Signed in successfully!')
          // Redirect to pricing to choose plan after sign in
          router.push('/pricing')
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black-purple p-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-8 shadow-xl shadow-purple-900/10">
        <CardHeader className="space-y-1 text-center p-0 mb-6">
          <CardTitle className="text-3xl font-display font-bold text-foreground mb-2">
            {isSignUp ? 'Join the Waitlist' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            {isSignUp ? 'Enter your details to join our waitlist' : 'Enter your credentials to access your account'}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                isSignUp ? 'Join Waitlist' : 'Sign In'
              )}
            </button>
            <div className="text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button 
                    className="text-primary hover:underline transition-colors duration-200 disabled:opacity-50"
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    className="text-primary hover:underline transition-colors duration-200 disabled:opacity-50"
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                  >
                    Join Waitlist
                  </button>
                </>
              )}
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