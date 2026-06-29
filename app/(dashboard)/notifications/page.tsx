'use client'

import { motion } from 'framer-motion'
import { NotificationsList } from '@/components/notifications/notifications-list'

export default function NotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on your career progress</p>
      </div>

      <NotificationsList />
    </motion.div>
  )
}
