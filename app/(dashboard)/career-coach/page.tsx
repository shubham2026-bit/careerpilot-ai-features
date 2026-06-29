'use client'

import { motion } from 'framer-motion'
import { CareerCoachChat } from '@/components/chat/career-coach-chat'

export default function CareerCoachPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Career Coach</h1>
        <p className="text-muted-foreground">Get personalized career guidance from your AI Career Coach</p>
      </div>

      <div className="h-[600px] lg:h-[700px]">
        <CareerCoachChat />
      </div>
    </motion.div>
  )
}
