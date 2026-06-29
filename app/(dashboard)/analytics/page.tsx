'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react'

const chartData = [
  { month: 'Jan', views: 400, applications: 24 },
  { month: 'Feb', views: 600, applications: 35 },
  { month: 'Mar', views: 800, applications: 42 },
  { month: 'Apr', views: 900, applications: 55 },
  { month: 'May', views: 1100, applications: 62 },
  { month: 'Jun', views: 1400, applications: 78 },
]

const COLORS = ['#818cf8', '#a78bfa', '#f472b6', '#fbbf24']

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Profile Views', value: '4,200', icon: Users, change: '+12%' },
    { label: 'Applications Sent', value: '48', icon: Zap, change: '+8%' },
    { label: 'Profile Score', value: '78/100', icon: TrendingUp, change: '+5' },
    { label: 'Response Rate', value: '32%', icon: BarChart3, change: '+4%' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your career growth metrics</p>
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
                <Icon className="text-indigo-500" size={24} />
                <span className="text-xs font-semibold text-emerald-500">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Line Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Activity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="var(--color-accent)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Application Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'LinkedIn', value: 35 },
                  { name: 'Indeed', value: 28 },
                  { name: 'CareerPilot', value: 25 },
                  { name: 'Other', value: 12 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color) => (
                  <Cell key={`cell-${color}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  )
}
