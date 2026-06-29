'use client'

import { useNotification } from '@/providers/notification-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotification()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-500" />
      case 'error':
        return <AlertCircle size={20} className="text-destructive" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />
      case 'info':
      default:
        return <InfoIcon size={20} className="text-blue-500" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20'
      case 'error':
        return 'bg-destructive/10 border-destructive/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className={`pointer-events-auto ${getBgColor(notification.type)} border rounded-lg p-4 backdrop-blur-md shadow-lg max-w-sm`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{notification.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0 hover:bg-transparent"
                onClick={() => removeNotification(notification.id)}
              >
                <X size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
