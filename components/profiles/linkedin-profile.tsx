'use client'

import { useState } from 'react'
import { addLinkedInProfile } from '@/app/actions/profile-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, Users, Award, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export function LinkedInProfile({ initialData }: { initialData?: any }) {
  const [profileUrl, setProfileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(initialData?.analysis)

  async function handleConnect() {
    if (!profileUrl) return

    setLoading(true)
    try {
      const result = await addLinkedInProfile(profileUrl, {
        fullName: 'John Smith',
        headline: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        connections: 850,
        endorsements: 250,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        experience: [
          {
            title: 'Senior Developer',
            company: 'Tech Company',
            duration: '2021-Present',
          },
        ],
        education: [
          {
            school: 'UC Berkeley',
            degree: 'BS Computer Science',
          },
        ],
      })
      setAnalysis(result.analysis)
      setProfileUrl('')
    } catch (error) {
      console.error('[v0] Failed to add LinkedIn profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!analysis) {
    return (
      <Card className="p-8 border-dashed border-2">
        <CardHeader>
          <CardTitle>Connect LinkedIn Profile</CardTitle>
          <CardDescription>Add your LinkedIn profile URL to get AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="https://linkedin.com/in/yourprofile"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          <Button onClick={handleConnect} disabled={loading || !profileUrl} className="w-full">
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
          { label: 'Overall', value: analysis.overallScore, icon: TrendingUp, color: '#6366f1' },
          { label: 'Completeness', value: analysis.completenessScore, icon: Award, color: '#8b5cf6' },
          { label: 'Visibility', value: analysis.visibilityScore, icon: Users, color: '#ec4899' },
          { label: 'Engagement', value: analysis.engagementScore, icon: Briefcase, color: '#f59e0b' },
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
          { icon: TrendingUp, label: 'Recommendations', items: analysis.recommendations, color: 'text-blue-500' },
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
