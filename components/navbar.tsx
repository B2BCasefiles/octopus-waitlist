"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/hooks/use-supabase"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useSupabase()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-black/20" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-white">OCTOPUS CLIPS</div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#videos" className="text-white/80 hover:text-white transition-colors">
              Videos
            </a>
            <a href="#features" className="text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white/80 text-sm hidden md:inline">
                  {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
                <Button 
                  className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/signin'}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6"
                  onClick={() => window.location.href = '/signin'}
                >
                  Join Waitlist
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
