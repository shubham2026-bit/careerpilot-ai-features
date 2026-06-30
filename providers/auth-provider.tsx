'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthState } from '@/lib/types/auth'
import { getSupabaseClient, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '@/lib/auth-client'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  })

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for demo session first
        if (typeof window !== 'undefined') {
          const demoSession = localStorage.getItem('demo_session')
          if (demoSession) {
            const session = JSON.parse(demoSession)
            console.log('[v0] Using demo session:', session.user.email)
            setAuthState({
              isAuthenticated: true,
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.full_name || '',
                avatar: session.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                createdAt: new Date(session.user.created_at),
              },
              isLoading: false,
              error: null,
            })
            return
          }
        }
        
        const supabase = getSupabaseClient()
        if (!supabase) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Supabase client not initialized',
          })
          return
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setAuthState({
            isAuthenticated: true,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || '',
              avatar: session.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
              createdAt: new Date(session.user.created_at),
            },
            isLoading: false,
            error: null,
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        console.error('[v0] Session check error:', error)
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        })
      }
    }

    checkSession()

    // Subscribe to auth changes
    const supabase = getSupabaseClient()
    if (!supabase) {
      return
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthState({
            isAuthenticated: true,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || '',
              avatar: session.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
              createdAt: new Date(session.user.created_at),
            },
            isLoading: false,
            error: null,
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await supabaseSignIn(email, password)
      
      // Immediately update state with the authenticated user
      if (data.user) {
        setAuthState({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || '',
            avatar: data.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
            createdAt: new Date(data.user.created_at),
          },
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await supabaseSignUp(email, password)
      
      // Update user metadata with name
      const supabase = getSupabaseClient()
      if (supabase && data.user) {
        await supabase.auth.updateUser({
          data: { full_name: name }
        })
        
        // Set authenticated state for newly registered user
        setAuthState({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
            createdAt: new Date(data.user.created_at),
          },
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabaseSignOut()
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Return default state during SSR/hydration mismatch
    return {
      isAuthenticated: false,
      user: null,
      isLoading: true,
      error: null,
      login: async () => {},
      logout: async () => {},
      register: async () => {},
    }
  }
  return context
}
