'use client'

import { motion } from 'framer-motion'
import { SettingsPanel } from '@/components/settings/settings-panel'

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
      </div>

      <SettingsPanel />
    </motion.div>
  )
}
