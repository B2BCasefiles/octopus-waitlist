'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const authSubscriptionRef = useRef<any>(null)

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session state quickly
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setUser(session?.user || null)
          setLoading(false)
        }
        
        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (isMounted) {
              setUser(session?.user || null)
            }
          }
        )
        
        authSubscriptionRef.current = subscription
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    initializeAuth()
    
    return () => {
      isMounted = false
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) return { error: error.message, requiresConfirmation: false }
      
      // Check if user needs to confirm email
      if (data.user && data.user.email_confirmed_at === null) {
        // User needs to confirm email, don't set session
        setLoading(false)
        return { error: null, requiresConfirmation: true }
      }
      
      // Get the session immediately after signup
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
      setLoading(false)
      
      return { error: null, requiresConfirmation: false }
    } catch (error: any) {
      setLoading(false)
      return { error: error.message, requiresConfirmation: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) return { error: error.message }
      
      // Get the session immediately after sign in
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
      setLoading(false)
      
      return { error: null }
    } catch (error: any) {
      setLoading(false)
      return { error: error.message }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      console.error('Error signing out:', error.message)
    }
  }

  return { user, loading, signUp, signIn, signOut }
}