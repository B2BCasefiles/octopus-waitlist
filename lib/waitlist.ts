import { supabase } from '@/lib/supabase/client'

export interface WaitlistEntry {
  id: string
  email: string
  created_at: string
  waitlist_status: 'pending' | 'approved' | 'rejected'
  beta_access: boolean
  bought_at?: string
}

export const addToWaitlist = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // Update the user's profile to set waitlist_status to 'pending'
    const { data, error } = await supabase
      .from('profiles')
      .update({ waitlist_status: 'pending' })
      .eq('id', userId)
      .select()
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('Error adding to waitlist:', error)
    return { success: false, message: error.message || 'Failed to join waitlist' }
  }
}

export const getWaitlistEntry = async (userId: string): Promise<WaitlistEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at, waitlist_status, beta_access, bought_at')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null
      }
      throw error
    }
    
    return data
  } catch (error: any) {
    console.error('Error getting waitlist entry:', error)
    return null
  }
}