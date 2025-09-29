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
        className="h-16 w-auto mx-auto sm:h-20 rounded-2xl object-contain"
        loading="lazy"
      />
      <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider text-center">Stop Paying $29/Month <br/> For Amateur-Looking Clips</h4>

      <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-6 sm:mb-12 tracking-widest uppercase font-medium text-center">
      Reserve Your Spot for Pro-Quality, 
        <br />
        Cinematic Captions in Minutes with an effective price.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-6">
        <button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold h-10 sm:h-12 px-4 sm:px-6 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto text-sm sm:text-base"
          onClick={() => {
            // Store email in sessionStorage to use after auth
            if (email) {
              sessionStorage.setItem('waitlistEmail', email)
            }
            router.push('/signup')
          }}
        >
          JOIN WAITLIST
        </button>
      </div>
    </div>
  )

}
