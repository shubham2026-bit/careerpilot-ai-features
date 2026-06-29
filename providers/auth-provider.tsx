'use client'

import React, { createContext, useContext, useState } from 'react'
import type { User, AuthState } from '@/lib/types/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy user for demo purposes
const DUMMY_USER: User = {
  id: '1',
  email: 'demo@careerpilot.ai',
  name: 'Alex Johnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  createdAt: new Date('2024-01-15'),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  })

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Demo: any password works for the demo email
      if (email === 'demo@careerpilot.ai' || email.includes('@')) {
        setAuthState({
          isAuthenticated: true,
          user: { ...DUMMY_USER, email },
          isLoading: false,
          error: null,
        })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }))
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setAuthState({
        isAuthenticated: true,
        user: { ...DUMMY_USER, email, name },
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }))
      throw error
    }
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    })
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
      isLoading: false,
      error: null,
      login: async () => {},
      logout: () => {},
      register: async () => {},
    }
  }
  return context
}
