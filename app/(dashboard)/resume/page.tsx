'use client'

import { useState, useEffect } from 'react'
import { getUserResumes, getResumeAnalysis, deleteResume } from '@/app/actions/resume-actions'
import { ResumeUpload } from '@/components/resume/resume-upload'
import { ResumeAnalysis } from '@/components/resume/resume-analysis'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadResumes()
  }, [])

  async function loadResumes() {
    try {
      setLoading(true)
      const data = await getUserResumes()
      setResumes(data)
      if (data.length > 0 && !selectedResume) {
        setSelectedResume(data[0].id)
        await loadAnalysis(data[0].id)
      }
    } catch (error) {
      console.error('[v0] Failed to load resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadAnalysis(resumeId: string) {
    try {
      const data = await getResumeAnalysis(resumeId)
      setSelectedAnalysis(data.analysis)
    } catch (error) {
      console.error('[v0] Failed to load analysis:', error)
    }
  }

  async function handleResumeSelect(resumeId: string) {
    setSelectedResume(resumeId)
    await loadAnalysis(resumeId)
  }

  async function handleDeleteResume(resumeId: string) {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    try {
      setDeleting(resumeId)
      await deleteResume(resumeId)
      await loadResumes()
      if (selectedResume === resumeId) {
        setSelectedResume(null)
        setSelectedAnalysis(null)
      }
    } catch (error) {
      console.error('[v0] Failed to delete resume:', error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload and analyze your resume with AI-powered insights</p>
      </motion.div>

      {/* Upload Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ResumeUpload onUploadSuccess={() => loadResumes()} />
      </motion.div>

      {/* Resume History */}
      {!loading && resumes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-xl font-semibold">Your Resumes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedResume === resume.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => handleResumeSelect(resume.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <FileText size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteResume(resume.id)
                        }}
                        disabled={deleting === resume.id}
                      >
                        {deleting === resume.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                    <p className="font-medium text-sm truncate">{resume.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analysis Section */}
      {selectedResume && selectedAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <ResumeAnalysis
            analysis={selectedAnalysis}
            resume={resumes.find((r) => r.id === selectedResume)}
          />
        </motion.div>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading your resumes...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
