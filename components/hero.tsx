"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="mb-8 p-3 border-[12px] border-gray-700/30 rounded-2xl">
        <img 
          src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/LOGO.png" 
          alt="OctopusClips Logo"
          className="h-20 w-auto mx-auto rounded-2xl"
          loading="lazy"
        />
      </div>
      <h4 className="text-4xl font-bold text-white mb-4 tracking-wider">Stop Paying $29/Month <br/> For Amateur-Looking Clips</h4>

      <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-12 tracking-widest uppercase font-medium">
      Reserve Your Spot for Pro-Quality, 
        <br />
        Cinematic Captions in Minutes with an effective price.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
        />
        <button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold h-12 px-6 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          onClick={() => {
            // Store email in sessionStorage to use after auth
            if (email) {
              sessionStorage.setItem('waitlistEmail', email)
            }
            router.push('/signin')
          }}
        >
          JOIN WAITLIST
        </button>
      </div>
    </div>
  )
}
