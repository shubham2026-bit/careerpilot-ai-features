'use client'

import { useState } from 'react'
import { addPortfolioProject, getPortfolioProjects, deletePortfolioProject, getPortfolioAnalysis } from '@/app/actions/profile-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Trash2, Plus, Code, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export function PortfolioManager() {
  const [projects, setProjects] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    technologies: '',
    role: '',
  })

  async function loadData() {
    setLoading(true)
    try {
      const [projectsData, analysisData] = await Promise.all([getPortfolioProjects(), getPortfolioAnalysis()])
      setProjects(projectsData)
      setAnalysis(analysisData.analysis)
    } catch (error) {
      console.error('[v0] Failed to load portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProject() {
    if (!formData.title || !formData.url) return

    try {
      await addPortfolioProject({
        title: formData.title,
        description: formData.description,
        url: formData.url,
        technologies: formData.technologies.split(',').map((t) => t.trim()),
        role: formData.role,
      })

      setFormData({ title: '', description: '', url: '', technologies: '', role: '' })
      setShowForm(false)
      await loadData()
    } catch (error) {
      console.error('[v0] Failed to add project:', error)
    }
  }

  async function handleDeleteProject(projectId: string) {
    if (!confirm('Delete this project?')) return

    try {
      await deletePortfolioProject(projectId)
      await loadData()
    } catch (error) {
      console.error('[v0] Failed to delete project:', error)
    }
  }

  if (!analysis) {
    return (
      <Card className="p-8 text-center">
        <Button onClick={loadData} disabled={loading}>
          {loading ? 'Loading...' : 'Load Portfolio'}
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', value: analysis.overallScore, icon: TrendingUp, color: '#6366f1' },
          { label: 'Presentation', value: analysis.presentationScore, icon: Code, color: '#8b5cf6' },
          { label: 'Diversity', value: analysis.diversityScore, icon: Award, color: '#ec4899' },
          { label: 'Impact', value: analysis.impactScore, icon: ExternalLink, color: '#f59e0b' },
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

      {/* Add Project Button */}
      <div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Add Project
        </Button>
      </div>

      {/* Project Form */}
      {showForm && (
        <Card className="p-6 space-y-4">
          <Input
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            placeholder="Project URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Your Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Input
            placeholder="Technologies (comma-separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddProject} className="flex-1">
              Add Project
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Projects</h3>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">No projects added yet</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden hover:border-primary/50 transition-all">
                  {project.imageUrl && (
                    <div className="w-full h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Code size={40} className="text-muted-foreground" />
                    </div>
                  )}
                  <CardContent className="pt-6 space-y-2">
                    <h4 className="font-semibold line-clamp-2">{project.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech: string) => (
                          <span key={tech} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        View <ExternalLink size={14} />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Strengths', items: analysis.strengths },
          { label: 'Improvements', items: analysis.improvements },
          { label: 'Recommendations', items: analysis.recommendations },
        ].map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{section.label}</CardTitle>
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
