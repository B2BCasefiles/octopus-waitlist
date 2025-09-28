'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { WaitlistForm } from './waitlist-form'
import { createRazorpayOrder, verifyPaymentSignature } from '@/lib/payment'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export function Pricing() {
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const { user } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (!error && data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleFounderPayment = async () => {
    if (!user) {
      toast.error('Please sign in to purchase Founder Access')
      window.location.href = '/signin'
      return
    }
    
    setLoading(true)
    try {
      const userId = user.id
      const amount = 10 // $10 for founder access
      
      const orderData = await createRazorpayOrder(amount, userId) // The function handles paise conversion internally
      
      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'OctopusClips',
        description: 'Founder Access Plan',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify the payment signature by calling backend API
            const verificationResult = await verifyPaymentSignature(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            const result = await verificationResult.json();
            
            if (result.success) {
              toast.success('Payment successful! You now have access to Founder plan.')
              // Redirect to dashboard immediately
              window.location.href = '/dashboard';
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#8b5cf6', // Using a purple color that matches your theme
        },
      }
      
      const rzp1 = new (window as any).Razorpay(options)
      rzp1.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Waitlist Card */}
          <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free Waitlist</h3>
              <div className="text-3xl font-bold text-primary">Free</div>
              <p className="text-muted-foreground mt-2">Join the community</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Early access notifications</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Community updates</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Feature previews</span>
              </li>
            </ul>
            
            {!user ? (
              <button
                onClick={() => router.push('/signin')}
                className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent transition-colors border border-border"
              >
                Join Waitlist
              </button>
            ) : userProfile?.beta_access ? (
              <div className="text-center py-3 text-sm text-green-500 font-medium">
                ✓ Already have access
              </div>
            ) : userProfile?.waitlist_status === 'pending' ? (
              <div className="text-center py-3 text-sm text-yellow-500 font-medium">
                ✓ Already on waitlist
              </div>
            ) : (
              <WaitlistForm plan="free" />
            )}
          </div>

          {/* Founder Access Card */}
          <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 relative">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Limited Offer
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Founder Access</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-primary">$10</span>
                <span className="text-muted-foreground line-through">$15</span>
              </div>
              <p className="text-muted-foreground mt-2">One-time payment</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Full platform access</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">5,000 clip credits</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground">Exclusive features</span>
              </li>
            </ul>
            
            {user ? (
              userProfile?.beta_access ? (
                <button className="w-full py-3 bg-secondary text-muted-foreground rounded-lg font-medium cursor-not-allowed">
                  Already Purchased
                </button>
              ) : (
                <button
                  className="w-full py-3 bg-primary/20 text-primary-foreground rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  Coming Soon
                </button>
              )
            ) : (
              <button
                className="w-full py-3 bg-primary/20 text-primary-foreground rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            )}
            
            {!user && (
              <p className="text-xs text-center text-muted-foreground mt-3">Sign in to purchase access</p>
            )}
            
            {userProfile?.beta_access && (
              <p className="text-xs text-center text-green-500 font-medium mt-3">✓ You have access!</p>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Have questions? <a href="/contact" className="text-primary hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  )
}
