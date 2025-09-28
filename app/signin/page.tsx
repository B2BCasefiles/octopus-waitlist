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
        const { error } = await signUp(email, password)
        if (error) {
          toast.error(`Sign up failed: ${error}`)
        } else {
          toast.success('Check your email to confirm your account!')
          // After sign up, redirect to pricing to choose plan
          setTimeout(() => {
            router.push('/pricing')
          }, 2000)
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
    <div className="flex items-center justify-center min-h-screen relative p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900/60 to-black/80" />
      <div className="absolute inset-0 bg-black/40" />
      <Card className="w-full max-w-md glass border-white/10 backdrop-blur-lg relative z-10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-display font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            {isSignUp ? 'Enter your details to create an account' : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <button 
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Processing...
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
            <div className="text-center text-sm text-gray-300">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button 
                    className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200 disabled:opacity-50"
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
                    className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200 disabled:opacity-50"
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}