import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add user to waitlist
    const { data, error } = await supabase
      .from('profiles')
      .update({
        waitlist_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Waitlist addition error:', error)
      return NextResponse.json(
        { error: 'Failed to add to waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      data
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}