'use client'

import { useAuth } from '@/providers/auth-provider'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Loader2 } from 'lucide-react'
import { LandingNavbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show dashboard with a welcome message
  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="space-y-6 py-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome! Select a section from the sidebar to get started</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold">Resume Analysis</h3>
              <p className="text-sm text-muted-foreground">Upload and analyze your resume</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold">LinkedIn Insights</h3>
              <p className="text-sm text-muted-foreground">Optimize your profile</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold">Job Matching</h3>
              <p className="text-sm text-muted-foreground">Find suitable jobs</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold">Career Coach</h3>
              <p className="text-sm text-muted-foreground">Get personalized advice</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Otherwise show landing page
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  )
}
