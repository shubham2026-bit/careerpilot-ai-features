'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, ExternalLink, BarChart3 } from 'lucide-react'
import { PORTFOLIO_PROJECTS } from '@/lib/constants/dummy-data'

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground">Showcase your best work</p>
      </motion.div>

      {/* Connect Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Add Your Portfolio</h3>
            <p className="text-sm text-muted-foreground">Link your portfolio website for analysis</p>
          </div>
          <Button className="bg-gradient-primary">
            <Globe size={18} className="mr-2" />
            Add Portfolio
          </Button>
        </Card>
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Featured Projects</h2>
        <div className="space-y-3">
          {PORTFOLIO_PROJECTS.map((project) => (
            <Card key={project.id} className="p-6 hover:border-accent/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink size={18} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-muted/50 text-xs font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* SEO Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-indigo-500" size={24} />
            <h3 className="text-lg font-semibold text-foreground">SEO Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lighthouse Score</p>
              <p className="text-2xl font-bold text-foreground">94/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mobile Score</p>
              <p className="text-2xl font-bold text-foreground">89/100</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
