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
              // Redirect to dashboard
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 2000);
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
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-900/40 to-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4 text-balance tracking-wide">
            Choose Your Access Level
          </h2>
          <p className="text-xl text-muted-foreground text-pretty tracking-wide">
                Investment in your content future, not another subscription
              </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Waitlist */}
          <Card className="glass border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display font-bold text-white">Free Waitlist</CardTitle>
              <div className="text-4xl font-display font-bold text-white">$0</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-brand-blue" />
                  <span className="text-muted-foreground">Get notified first</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-brand-blue" />
                  <span className="text-muted-foreground">Launch updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-brand-blue" />
                  <span className="text-muted-foreground">Community access</span>
                </div>
              </div>
              {!user ? (
                <button 
                  onClick={() => router.push('/signin')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign In to Join
                </button>
              ) : userProfile?.beta_access ? (
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">✓ Already have access</p>
                </div>
              ) : userProfile?.waitlist_status === 'pending' ? (
                <div className="text-center">
                  <p className="text-sm text-yellow-600 font-medium">✓ Already on waitlist</p>
                </div>
              ) : (
                <WaitlistForm plan="free" />
              )}
            </CardContent>
          </Card>

          {/* Founder Access */}
          <Card className="glass border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                33% OFF
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-display font-bold text-white">
                  Founder Access – Limited
                </CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-display font-bold text-white">$67</span>
                  <span className="text-lg text-gray-400 line-through">$100</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Immediate beta access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">1,500 clip credits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Custom font upload</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Professional color grading</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Multi-platform export</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">Lifetime 20% discount</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-brand-gold" />
                    <span className="text-foreground">VIP creator community</span>
                  </li>
              </ul>
              {user ? (
                userProfile?.beta_access ? (
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-medium transition-all duration-300 opacity-60 cursor-not-allowed">
                    Already Have Access
                  </button>
                ) : (
                  <button 
                    className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-medium hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    onClick={handleFounderPayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Get Founder Access'}
                  </button>
                )
              ) : (
                <button 
                  className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-medium hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/signin')}
                >
                  Sign In to Purchase
                </button>
              )}
              {!user && (
                <p className="text-xs text-center text-muted-foreground">Sign in to purchase Founder Access</p>
              )}
              {userProfile?.beta_access && (
                <p className="text-xs text-center text-green-600 font-medium">✓ You have Founder Access!</p>
              )}
              {!userProfile?.beta_access && (
                <>
                  <p className="text-xs text-center text-muted-foreground">Only 150 founder spots remaining</p>
                  <p className="text-xs text-center text-muted-foreground">7‑day money‑back, no questions asked</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
