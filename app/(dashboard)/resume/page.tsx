'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Download, Trash2 } from 'lucide-react'
import { SAMPLE_RESUMES } from '@/lib/constants/dummy-data'

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Resume</h1>
        <p className="text-muted-foreground">Upload and analyze your resumes</p>
      </motion.div>

      {/* Upload Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-8 border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <Upload className="text-indigo-500" size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
            </div>
            <Button className="bg-gradient-primary">Choose File</Button>
          </div>
        </Card>
      </motion.div>

      {/* Uploaded Resumes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Your Resumes</h2>
        <div className="space-y-3">
          {SAMPLE_RESUMES.map((resume) => (
            <Card key={resume.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{resume.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Score: {resume.score}/100</span>
                    <span>•</span>
                    <span className="capitalize">{resume.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Download size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
