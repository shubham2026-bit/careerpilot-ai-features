'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { useRouter } from 'next/navigation'
import { Moon, Sun, Mail, Lock, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { isDark, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('account')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 border-b border-border"
      >
        {[
          { id: 'account', label: 'Account', icon: SettingsIcon },
          { id: 'theme', label: 'Theme', icon: Moon },
          { id: 'security', label: 'Security', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input placeholder={user?.name} className="mt-2 bg-muted/50" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input placeholder={user?.email} className="mt-2 bg-muted/50" disabled />
              </div>
              <Button className="bg-gradient-primary">Update Profile</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-destructive/30 bg-destructive/5">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Permanently delete your account</p>
            <Button variant="destructive">Delete Account</Button>
          </Card>
        </motion.div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Theme Preference</h3>
            <div className="space-y-3">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
              ].map((theme) => {
                const Icon = theme.icon
                const isSelected = isDark && theme.id === 'dark' || !isDark && theme.id === 'light'
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id as 'light' | 'dark')}
                    className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-foreground">{theme.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Password</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input type="password" placeholder="••••••••" className="mt-2 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="••••••••" className="mt-2 bg-muted/50" />
              </div>
              <Button className="bg-gradient-primary">Update Password</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Session</h3>
            <p className="text-sm text-muted-foreground">Sign out from all devices</p>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
