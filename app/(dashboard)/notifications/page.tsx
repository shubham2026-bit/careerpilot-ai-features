'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import { NOTIFICATIONS_LIST } from '@/lib/constants/dummy-data'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on your career progress</p>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
        {['All', 'Unread', 'Success', 'Alerts'].map((filter) => (
          <Button
            key={filter}
            variant={filter === 'All' ? 'default' : 'outline'}
            className={filter === 'All' ? 'bg-gradient-primary' : ''}
            size="sm"
          >
            {filter}
          </Button>
        ))}
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {NOTIFICATIONS_LIST.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`p-4 flex items-start gap-4 ${
                !notif.read ? 'border-accent/50 bg-accent/5' : ''
              } hover:bg-muted/30 transition-colors`}
            >
              <div className="flex-shrink-0 mt-1">
                {notif.type === 'success' ? (
                  <CheckCircle className="text-emerald-500" size={20} />
                ) : notif.type === 'warning' ? (
                  <AlertCircle className="text-yellow-500" size={20} />
                ) : (
                  <Bell className="text-blue-500" size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{notif.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notif.timestamp).toLocaleDateString()}
                </p>
              </div>

              <Button variant="ghost" size="icon" className="flex-shrink-0 text-destructive hover:bg-destructive/10">
                <Trash2 size={18} />
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
