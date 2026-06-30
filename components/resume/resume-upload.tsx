'use client'

import { useState } from 'react'
import { uploadResume } from '@/app/actions/resume-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ResumeUploadProps {
  onUploadSuccess?: (data: any) => void
}

export function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedData, setUploadedData] = useState<any>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadResume(formData)

      if (result.success) {
        setSuccess(true)
        setUploadedData(result.data)
        onUploadSuccess?.(result)
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume')
    } finally {
      setIsLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Upload a PDF, Word document, or text file to get AI-powered analysis and recommendations
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-full">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
                id="resume-file"
              />
              <label htmlFor="resume-file" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-2 p-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-colors">
                  {isLoading ? (
                    <Loader2 size={32} className="text-primary animate-spin" />
                  ) : (
                    <Upload size={32} className="text-primary" />
                  )}
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      {isLoading ? 'Processing...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? 'Analyzing your resume...' : 'PDF, Word, or TXT files up to 10MB'}
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600"
              >
                <AlertCircle size={18} />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {success && uploadedData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={18} />
                  <p className="font-medium">Resume analyzed successfully!</p>
                </div>
                <div className="space-y-2 text-sm text-foreground">
                  <p><strong>Name:</strong> {uploadedData.name}</p>
                  <p><strong>Overall Score:</strong> {uploadedData.scores.overallScore}/100</p>
                  <p><strong>Skills Found:</strong> {uploadedData.skills.join(', ') || 'Not detected'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
