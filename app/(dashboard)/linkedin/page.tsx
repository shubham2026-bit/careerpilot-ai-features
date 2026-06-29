'use client'

import { LinkedInProfile } from '@/components/profiles/linkedin-profile'
import { motion } from 'framer-motion'

export default function LinkedInPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">LinkedIn Optimization</h1>
        <p className="text-muted-foreground">Connect and optimize your LinkedIn profile for career success</p>
      </div>

      <LinkedInProfile />
    </motion.div>
  )
}
