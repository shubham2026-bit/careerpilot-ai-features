'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DASHBOARD_SCORES, CHART_DATA, RECENT_ACTIVITIES } from '@/lib/constants/dummy-data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Zap, Award, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const scores = [
    { label: 'Career Score', value: DASHBOARD_SCORES.career, icon: Award, color: 'from-indigo-500 to-indigo-600' },
    { label: 'ATS Score', value: DASHBOARD_SCORES.ats, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'LinkedIn Score', value: DASHBOARD_SCORES.linkedin, icon: Award, color: 'from-pink-500 to-pink-600' },
    { label: 'GitHub Score', value: DASHBOARD_SCORES.github, icon: Zap, color: 'from-orange-500 to-orange-600' },
    { label: 'Portfolio Score', value: DASHBOARD_SCORES.portfolio, icon: Award, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Interview Readiness', value: DASHBOARD_SCORES.interview, icon: TrendingUp, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Job Match', value: DASHBOARD_SCORES.jobMatch, icon: Zap, color: 'from-fuchsia-500 to-fuchsia-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s your career intelligence dashboard.</p>
      </motion.div>

      {/* Score Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {scores.map((score) => {
          const Icon = score.icon
          return (
            <motion.div key={score.label} variants={item}>
              <Card className="p-6 hover:border-accent/50 transition-all hover:shadow-lg group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${score.color} text-white`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                    <ArrowUpRight size={16} />
                    +5
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{score.label}</p>
                <p className="text-2xl font-bold text-foreground">{score.value}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Career Growth Chart */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Career Growth</h3>
                <p className="text-sm text-muted-foreground">Score progression over time</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={CHART_DATA.careerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Applications Chart */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Applications</h3>
                <p className="text-sm text-muted-foreground">Weekly job applications</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={CHART_DATA.applications}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="var(--color-accent)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Skills Growth Chart */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Skills Growth</h3>
                <p className="text-sm text-muted-foreground">Endorsed skills growth</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={CHART_DATA.skills}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="skills"
                    fill="var(--color-accent)"
                    fillOpacity={0.2}
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your latest updates</p>
                </div>
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="sm" className="text-accent">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
