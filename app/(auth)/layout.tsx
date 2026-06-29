import { Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Auth - CareerPilot AI',
  description: 'Sign in or create an account',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
      </div>

      {/* Top Logo */}
      <Link href="/" className="fixed top-6 left-6 flex items-center gap-2 font-bold text-lg group">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Zap size={24} className="text-white" />
        </div>
        <span className="text-foreground">CareerPilot</span>
      </Link>

      {/* Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
