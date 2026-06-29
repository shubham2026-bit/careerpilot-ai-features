'use client'

import { useState, useEffect } from 'react'
import { getNotifications, markNotificationAsRead, markAllAsRead, deleteNotification } from '@/app/actions/notification-actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Trash2, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function NotificationsList() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    try {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('[v0] Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(id: string) {
    await markNotificationAsRead(id)
    await loadNotifications()
  }

  async function handleMarkAllAsRead() {
    await markAllAsRead()
    await loadNotifications()
  }

  async function handleDelete(id: string) {
    await deleteNotification(id)
    await loadNotifications()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'resume_analysis':
        return <CheckCircle className="text-green-500" size={20} />
      case 'job_match':
        return <Zap className="text-yellow-500" size={20} />
      case 'skill_gap':
        return <AlertCircle className="text-orange-500" size={20} />
      default:
        return <Info className="text-blue-500" size={20} />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading notifications...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Mark All */}
      {unreadCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-12 text-center">
            <Bell size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, i) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`p-4 transition-all ${
                  !notification.read
                    ? 'bg-primary/5 border-primary/20'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="text-xs text-primary hover:underline"
                        >
                          {notification.actionLabel || 'View'}
                        </a>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
