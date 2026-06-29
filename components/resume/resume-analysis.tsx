'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { AlertCircle, CheckCircle, Lightbulb, Target, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'

interface ResumeAnalysisProps {
  analysis: any
  resume: any
}

export function ResumeAnalysis({ analysis, resume }: ResumeAnalysisProps) {
  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No analysis available yet. Upload a resume to see detailed insights.
        </CardContent>
      </Card>
    )
  }

  const scores = {
    overall: parseFloat(analysis.overallScore),
    skills: parseFloat(analysis.skillsScore),
    experience: parseFloat(analysis.experienceScore),
    education: parseFloat(analysis.educationScore),
    formatting: parseFloat(analysis.formattingScore),
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Work'
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Overall Resume Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={scores.overall}
                text={`${scores.overall.toFixed(0)}/100`}
                styles={buildStyles({
                  pathColor: getScoreColor(scores.overall),
                  textColor: getScoreColor(scores.overall),
                  trailColor: '#e2e8f0',
                  textSize: '16px',
                })}
              />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">Your resume is performing <strong className={scores.overall >= 80 ? 'text-green-600' : scores.overall >= 60 ? 'text-yellow-600' : 'text-red-600'}>{getScoreStatus(scores.overall)}</strong></p>
              <p className="text-sm text-foreground">This score reflects how well your resume is optimized for ATS systems and recruiter preferences.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Skills', score: scores.skills, icon: Target },
          { label: 'Experience', score: scores.experience, icon: TrendingUp },
          { label: 'Education', score: scores.education, icon: Award },
          { label: 'Formatting', score: scores.formatting, icon: CheckCircle },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <item.icon size={18} className="text-primary" />
                  <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                    {item.score.toFixed(0)}/100
                  </span>
                </div>
                <p className="text-sm font-medium">{item.label}</p>
                <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {analysis.improvements && analysis.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle size={20} />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.improvements.map((improvement: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{improvement}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Lightbulb size={20} />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <Lightbulb size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Missing Keywords */}
      {analysis.keywordMissing && analysis.keywordMissing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Keywords to Add</CardTitle>
            <CardDescription>
              These keywords are commonly found in successful resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordMissing.map((keyword: string, i: number) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-foreground"
                >
                  +{keyword}
                </motion.span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
