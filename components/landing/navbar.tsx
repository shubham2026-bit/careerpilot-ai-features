'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function LandingNavbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white" />
          </div>
          <span className="hidden sm:inline text-foreground">CareerPilot</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Features
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Pricing
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gradient-primary hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
