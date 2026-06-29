'use client'

import { useState, useEffect } from 'react'
import { getUserAnalytics, initializeUserAnalytics } from '@/app/actions/analytics-actions'
import { Card } from '@/components/ui/card'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      setLoading(true)
      let data = await getUserAnalytics()
      if (!data) {
        data = await initializeUserAnalytics()
      }
      setAnalytics(data)
    } catch (error) {
      console.error('[v0] Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </Card>
    )
  }

  // Mock chart data
  const careerGrowthData = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 58 },
    { month: 'Apr', score: 65 },
    { month: 'May', score: 72 },
    { month: 'Jun', score: analytics.careerGrowthScore || 78 },
  ]

  const applicationsData = [
    { week: 'W1', count: 5 },
    { week: 'W2', count: 8 },
    { week: 'W3', count: 6 },
    { week: 'W4', count: 12 },
  ]

  const stats = [
    {
      label: 'Total Resumes',
      value: analytics.totalResumeUploads || 0,
      icon: <BarChart3 size={24} />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Profile Views',
      value: analytics.totalProfileViews || 0,
      icon: <TrendingUp size={24} />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Avg Resume Score',
      value: `${Math.round(analytics.averageResumeScore || 0)}%`,
      icon: <PieChartIcon size={24} />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Career Growth',
      value: `${Math.round(analytics.careerGrowthScore || 0)}%`,
      icon: <TrendingUp size={24} />,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Career Growth Chart */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Career Growth Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={careerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(280, 85%, 65%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(280, 85%, 65%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Applications Chart */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Job Applications</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(280, 85%, 65%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Top Skills & Skill Gaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Top Skills */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Skills</h3>
          {analytics.topSkills?.length > 0 ? (
            <div className="space-y-3">
              {(analytics.topSkills || []).slice(0, 5).map((skill: string) => (
                <div key={skill} className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-fit">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills data yet</p>
          )}
        </Card>

        {/* Skill Gaps */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Skill Gaps to Address</h3>
          {analytics.skillGaps?.length > 0 ? (
            <div className="space-y-2">
              {(analytics.skillGaps || []).slice(0, 5).map((gap: string) => (
                <div
                  key={gap}
                  className="px-3 py-2 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm"
                >
                  {gap}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skill gaps identified</p>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
