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
      <img 
        src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/LOGO.png" 
        alt="OctopusClips Logo"
        className="h-20 w-auto mx-auto   rounded-2xl object-contain"
        loading="lazy"
      />
      <h4 className="text-4xl font-bold text-white mb-4 tracking-wider text-center">Stop Paying $29/Month <br/> For Amateur-Looking Clips</h4>

      <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-12 tracking-widest uppercase font-medium text-center">
      Reserve Your Spot for Pro-Quality, 
        <br />
        Cinematic Captions in Minutes with an effective price.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-6">
        <button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold h-12 px-6 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto"
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
