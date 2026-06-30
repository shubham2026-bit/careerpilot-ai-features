'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect old /dashboard routes to new route group URLs
    router.replace('/')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to dashboard...</p>
    </div>
  )
}
