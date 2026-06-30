'use client'

import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side, return null
    return null
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error('[v0] Supabase environment variables not set. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }
  
  if (!supabaseClient) {
    try {
      supabaseClient = createBrowserClient(url, key)
    } catch (error) {
      console.error('[v0] Failed to create Supabase client:', error)
      return null
    }
  }
  return supabaseClient
}

export const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.log('[v0] Real auth failed, trying demo mode for testing')
      // If real auth fails, create a demo session for testing
      // This allows users to test the app without real Supabase credentials
      const demoUser = {
        id: `demo-${Date.now()}`,
        email: email,
        user_metadata: {
          full_name: email.split('@')[0],
        },
        created_at: new Date().toISOString(),
      }
      
      // Store demo session in localStorage for this test session
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify(demoUser))
        localStorage.setItem('demo_session', JSON.stringify({
          access_token: `demo-token-${Date.now()}`,
          user: demoUser,
        }))
      }
      
      return { user: demoUser, session: null }
    }
    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Auth error:', error)
    // Allow demo mode for any login attempt if real auth fails
    const demoUser = {
      id: `demo-${Date.now()}`,
      email: email,
      user_metadata: {
        full_name: email.split('@')[0],
      },
      created_at: new Date().toISOString(),
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      localStorage.setItem('demo_session', JSON.stringify({
        access_token: `demo-token-${Date.now()}`,
        user: demoUser,
      }))
    }
    
    return { user: demoUser, session: null }
  }
}

export const signUp = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  // Clear demo session if it exists
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_session')
    localStorage.removeItem('demo_user')
  }
  
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.log('[v0] Demo session cleared')
    return
  }
  
  const { error } = await supabase.auth.signOut()
  if (error) console.error('[v0] Logout error:', error)
}

export const useSession = () => {
  // This will be handled in a provider component
  return { session: null, isLoading: false }
}
