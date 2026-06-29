'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Link2, TrendingUp, Users } from 'lucide-react'
import { LINKEDIN_INSIGHTS } from '@/lib/constants/dummy-data'

export default function LinkedInPage() {
  const stats = [
    { label: 'Profile Views', value: LINKEDIN_INSIGHTS.profileViews, icon: Users },
    { label: 'Search Appearances', value: LINKEDIN_INSIGHTS.searchAppearances, icon: TrendingUp },
    { label: 'Engagement Rate', value: `${LINKEDIN_INSIGHTS.engagementRate}%`, icon: TrendingUp },
    { label: 'Recommendations', value: LINKEDIN_INSIGHTS.recommendations, icon: Briefcase },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">LinkedIn</h1>
        <p className="text-muted-foreground">Optimize your LinkedIn profile</p>
      </motion.div>

      {/* Connect Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Connect Your LinkedIn</h3>
            <p className="text-sm text-muted-foreground">Get AI-powered insights on your profile</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Briefcase size={18} className="mr-2" />
            Connect
          </Button>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-blue-500" size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Profile Optimization Tips</h3>
          <ul className="space-y-2">
            {[
              'Add a professional profile photo',
              'Write a compelling headline',
              'Expand your skills section',
              'Get more recommendations',
              'Post regular content',
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </div>
  )
}
