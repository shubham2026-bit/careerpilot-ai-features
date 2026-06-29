'use client'

import { useState } from 'react'
import { addGitHubProfile } from '@/app/actions/profile-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Code, Star, Users, GitBranch, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export function GitHubProfile({ initialData }: { initialData?: any }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(initialData?.analysis)

  async function handleConnect() {
    if (!username) return

    setLoading(true)
    try {
      const result = await addGitHubProfile(username, {
        name: 'John Smith',
        bio: 'Full Stack Developer | Open Source Enthusiast',
        publicRepos: 42,
        followers: 1250,
        following: 180,
        totalStars: 850,
        topLanguages: ['TypeScript', 'React', 'Node.js', 'Python'],
        recentProjects: [
          {
            name: 'awesome-project',
            description: 'A full-stack web application',
            stars: 256,
            language: 'TypeScript',
          },
        ],
      })
      setAnalysis(result.analysis)
      setUsername('')
    } catch (error) {
      console.error('[v0] Failed to add GitHub profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!analysis) {
    return (
      <Card className="p-8 border-dashed border-2">
        <CardHeader>
          <CardTitle>Connect GitHub Profile</CardTitle>
          <CardDescription>Add your GitHub username to analyze your coding profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="github-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleConnect} disabled={loading || !username} className="w-full bg-gray-800 hover:bg-gray-900">
            {loading ? 'Analyzing...' : 'Connect Profile'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', value: analysis.overallScore, icon: Code, color: '#6366f1' },
          { label: 'Code Quality', value: analysis.codeQualityScore, icon: GitBranch, color: '#8b5cf6' },
          { label: 'Activity', value: analysis.activityScore, icon: Star, color: '#ec4899' },
          { label: 'Diversity', value: analysis.diversityScore, icon: Users, color: '#f59e0b' },
        ].map((score, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={score.value}
                      text={`${score.value}%`}
                      styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        textSize: '24px',
                        pathTransitionDuration: 0.5,
                        pathColor: score.color,
                        textColor: score.color,
                        trailColor: '#e5e7eb',
                        backgroundColor: '#f3f4f6',
                      })}
                    />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{score.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: CheckCircle, label: 'Strengths', items: analysis.strengths, color: 'text-green-500' },
          { icon: AlertCircle, label: 'Improvements', items: analysis.improvements, color: 'text-yellow-500' },
          { icon: Code, label: 'Recommendations', items: analysis.recommendations, color: 'text-blue-500' },
        ].map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <section.icon size={18} className={section.color} />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {section.items.map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
