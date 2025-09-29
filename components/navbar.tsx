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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/90 backdrop-blur-md border-b border-border" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-foreground font-serif uppercase">
              OCTOPUS CLIPS
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#videos" className="text-muted-foreground hover:text-foreground transition-colors">
              Videos
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-muted-foreground text-sm hidden md:inline">
                  {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground hover:bg-accent"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground hover:bg-accent"
                  onClick={() => window.location.href = '/signup'}
                >
                  Sign Up
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
                  onClick={() => window.location.href = '/signup'}
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
