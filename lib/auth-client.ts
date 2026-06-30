'use client'

import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side, return null or create a temporary instance
    return null
  }
  
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  return supabaseClient
}

export const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
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
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const useSession = () => {
  // This will be handled in a provider component
  return { session: null, isLoading: false }
}
