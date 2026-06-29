'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GitBranch, Star, Code, FileCode } from 'lucide-react'
import { GITHUB_STATS } from '@/lib/constants/dummy-data'

export default function GitHubPage() {
  const stats = [
    { label: 'Contributions', value: GITHUB_STATS.contributions, icon: Code },
    { label: 'Public Repos', value: GITHUB_STATS.publicRepos, icon: GitBranch },
    { label: 'Followers', value: GITHUB_STATS.followers, icon: Star },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">GitHub</h1>
        <p className="text-muted-foreground">Showcase your coding contributions</p>
      </motion.div>

      {/* Connect Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Connect Your GitHub</h3>
            <p className="text-sm text-muted-foreground">Display your repositories and contributions</p>
          </div>
          <Button className="bg-gray-800 hover:bg-gray-900">
            <FileCode size={18} className="mr-2" />
            Connect
          </Button>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <Icon className="text-gray-500 mb-4" size={28} />
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </motion.div>

      {/* Languages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Top Languages</h3>
          <div className="space-y-3">
            {GITHUB_STATS.topLanguages.map((lang) => (
              <div key={lang.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{lang.name}</span>
                  <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
