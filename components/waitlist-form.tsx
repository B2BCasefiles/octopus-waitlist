'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addToWaitlist } from '@/lib/waitlist'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'

interface WaitlistFormProps {
  variant?: 'default' | 'minimal'
}

export function WaitlistForm({ variant = 'default' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, signUp } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        // If user is not signed in, sign them up first
        const { error } = await signUp(email, 'tempPassword123!')
        if (error) {
          toast.error('Failed to create account: ' + error)
          return
        }
        toast.success('Account created! Check your email to confirm and complete waitlist signup.')
      } else {
        // If user is signed in, add them to waitlist
        const result = await addToWaitlist(user.id)
        
        if (result.success) {
          toast.success('Successfully joined the waitlist!')
          setEmail('')
        } else {
          toast.error(result.message || 'Failed to join waitlist')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm space-x-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Joining...' : 'Join'}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow"
        />
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </div>
    </form>
  )
}