'use client'

import { PortfolioManager } from '@/components/profiles/portfolio-manager'
import { motion } from 'framer-motion'

export default function PortfolioPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground">Showcase your best work and projects with AI-powered insights</p>
      </div>

      <PortfolioManager />
    </motion.div>
  )
}
