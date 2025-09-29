'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const authSubscriptionRef = useRef<any>(null)
  const isInitializedRef = useRef(false) // Prevent multiple initializations

  useEffect(() => {
    if (isInitializedRef.current) return; // Only initialize once
    isInitializedRef.current = true;
    
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
      
      // Make the signup request
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        // Check if it's a rate limiting error - Supabase returns 429 status
        if (error.status === 429 || error.code === 'rate_limit_exceeded' || 
            error.message.toLowerCase().includes('rate limit')) {
          console.error('Rate limit error during signup:', error)
          return { error: 'Too many requests. Please wait before trying again.', requiresConfirmation: false }
        }
        return { error: error.message, requiresConfirmation: false }
      }
      
      // Check if user needs to confirm email (common case for email confirmation)
      if (data.user && data.user.email_confirmed_at === null) {
        // If email needs confirmation, don't try to get session as user won't be logged in automatically
        setLoading(false)
        return { error: null, requiresConfirmation: true }
      }
      
      // If user is already confirmed (e.g., phone auth or auto-confirm in dev), set user
      if (data.user) {
        setUser(data.user)
      }
      
      setLoading(false)
      return { error: null, requiresConfirmation: false }
    } catch (error: any) {
      setLoading(false)
      // Check if it's a rate limiting error from the network level
      if (error.status === 429 || error.message.includes('429') || 
          error.message.toLowerCase().includes('rate limit')) {
        console.error('Rate limit error during signup:', error)
        return { error: 'Too many requests. Please wait before trying again.', requiresConfirmation: false }
      }
      return { error: error.message, requiresConfirmation: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        // Check if it's a rate limiting error - Supabase returns 429 status
        if (error.status === 429 || error.code === 'rate_limit_exceeded' || 
            error.message.toLowerCase().includes('rate limit')) {
          console.error('Rate limit error during sign in:', error)
          return { error: 'Too many requests. Please wait before trying again.' }
        }
        return { error: error.message }
      }
      
      // The signInWithPassword method automatically sets the session,
      // so we don't need to call getSession separately
      if (data?.user) {
        setUser(data.user)
      }
      setLoading(false)
      
      return { error: null }
    } catch (error: any) {
      setLoading(false)
      // Check if it's a rate limiting error from the network level
      if (error.status === 429 || error.message.includes('429') || 
          error.message.toLowerCase().includes('rate limit')) {
        console.error('Rate limit error during sign in:', error)
        return { error: 'Too many requests. Please wait before trying again.' }
      }
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