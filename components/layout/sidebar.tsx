'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { DASHBOARD_NAV_ITEMS, ACCOUNT_NAV_ITEMS } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('[v0] Logout failed:', error)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-40 lg:translate-x-0 overflow-y-auto"
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={24} className="text-white" />
            </div>
            <span className="text-sidebar-foreground">CareerPilot</span>
          </Link>

          {/* Main Navigation */}
          <nav className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-4">
              Main
            </p>
            {DASHBOARD_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-bold bg-accent/20 px-2 py-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Account Navigation */}
          <nav className="space-y-2 border-t border-sidebar-border pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-4">
              Account
            </p>
            {ACCOUNT_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              if (item.label === 'Logout') {
                return (
                  <button
                    key="logout"
                    onClick={handleLogout}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                      'text-sidebar-foreground hover:bg-sidebar-accent',
                      'text-destructive hover:bg-destructive/10'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-72" />
    </>
  )
}
