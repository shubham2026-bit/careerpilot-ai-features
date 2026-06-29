'use client'

import { motion } from 'framer-motion'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your career growth metrics and insights</p>
      </div>

      <AnalyticsDashboard />
    </motion.div>
  )
}
