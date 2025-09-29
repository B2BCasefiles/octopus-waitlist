'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
          color: '#8B5CF6', // Purple color for Razorpay
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-900 to-purple-800 p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Choose the plan that works best for you. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Free Waitlist Card */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 transition-all duration-300 hover:border-purple-500/50 shadow-lg shadow-purple-900/20">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Free Waitlist</h3>
                <div className="text-5xl font-bold text-purple-400 mb-2">Free</div>
                <p className="text-purple-200">Join the community</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Early access notifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Community updates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Feature previews</span>
                </li>
              </ul>
              
              {!user ? (
                <Button
                  onClick={() => router.push('/signin')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-6 rounded-xl font-bold uppercase transition-all duration-300"
                >
                  Join Waitlist
                </Button>
              ) : userProfile?.beta_access ? (
                <div className="text-center py-4 text-green-500 font-bold">
                  ✓ Already have access
                </div>
              ) : userProfile?.waitlist_status === 'pending' ? (
                <div className="text-center py-4 text-yellow-500 font-bold">
                  ✓ Already on waitlist
                </div>
              ) : (
                <WaitlistForm plan="free" />
              )}
            </Card>

            {/* Founder Access Card */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 transition-all duration-300 hover:border-purple-500/50 shadow-lg shadow-purple-900/20 relative">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 rounded-full text-sm font-bold">
                Limited Offer
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Founder Access</h3>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-5xl font-bold text-purple-400">$10</span>
                  <span className="text-3xl text-gray-500 line-through">$15</span>
                </div>
                <p className="text-purple-200">One-time payment</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Full platform access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">1,500 clip's credits</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Exclusive features</span>
                </li>
              </ul>
              
              {user ? (
                userProfile?.beta_access ? (
                  <Button className="w-full bg-gray-700 text-gray-400 text-lg py-6 rounded-xl font-bold cursor-not-allowed">
                    Already Purchased
                  </Button>
                ) : (
                  <Button
                    onClick={handleFounderPayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-lg py-6 rounded-xl font-bold uppercase transition-all duration-300"
                  >
                    {loading ? 'Processing...' : 'Get Founder Access'}
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => router.push('/signin')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-lg py-6 rounded-xl font-bold uppercase transition-all duration-300"
                >
                  Sign In to Purchase
                </Button>
              )}
              
              {!user && (
                <p className="text-center text-purple-300 mt-4">Sign in to purchase access</p>
              )}
              
              {userProfile?.beta_access && (
                <p className="text-center text-green-500 font-bold mt-4">✓ You have access!</p>
              )}
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
