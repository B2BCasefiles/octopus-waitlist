'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WaitlistForm } from '@/components/waitlist-form'
import { getWaitlistEntry } from '@/lib/waitlist'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useSupabase()
  
  useEffect(() => {
    if (user && !authLoading) {
      fetchProfileData()
    }
  }, [user, authLoading])

  const fetchProfileData = async () => {
    try {
      if (!user) return
      
      const profile = await getWaitlistEntry(user.id)
      setProfileData(profile)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            Please sign in to access your dashboard.
          </p>
          <Button onClick={() => window.location.href = '/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your OctopusClips account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Status</CardTitle>
            </CardHeader>
            <CardContent>
              {profileData ? (
                <div className="space-y-4">
                  <p className="text-foreground">
                    You joined the waitlist on: <span className="font-medium">{new Date(profileData.created_at).toLocaleDateString()}</span>
                  </p>
                  <p className="text-foreground">
                    Waitlist Status: <span className="font-medium capitalize">{profileData.waitlist_status}</span>
                  </p>
                  <p className="text-foreground">
                    Beta Access: <span className="font-medium">{profileData.beta_access ? 'Granted' : 'Pending'}</span>
                  </p>
                  {profileData.bought_at && (
                    <p className="text-foreground">
                      Purchased on: <span className="font-medium">{new Date(profileData.bought_at).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You're not currently on our waitlist. Join now to get early access!
                  </p>
                  <WaitlistForm />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-2">
                Email: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-foreground">
                Plan: <span className="font-medium">{profileData?.beta_access ? 'Pro' : 'Free Waitlist'}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}