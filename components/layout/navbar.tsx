'use client'

import { Bell, Search, Settings, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
  const { user } = useAuth()
  const themeContext = useTheme()
  const { isDark, setTheme } = themeContext

  return (
    <nav className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search jobs, skills..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="hover:bg-muted"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* Settings */}
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Settings size={20} />
            </Button>
          </Link>

          {/* User Avatar */}
          {user && (
            <Link href="/dashboard/settings">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors group">
                {user.avatar && (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
