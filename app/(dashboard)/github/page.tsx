'use client'

import { GitHubProfile } from '@/components/profiles/github-profile'
import { motion } from 'framer-motion'

export default function GitHubPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">GitHub Profile</h1>
        <p className="text-muted-foreground">Connect and analyze your coding profile and project achievements</p>
      </div>

      <GitHubProfile />
    </motion.div>
  )
}
