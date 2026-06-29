'use client'

import { motion } from 'framer-motion'
import { FileText, Briefcase, Code, Globe, Zap, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: FileText,
    title: 'Resume Analysis',
    description: 'Get AI-powered insights on your resume with ATS optimization tips and content improvements.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Briefcase,
    title: 'LinkedIn Optimization',
    description: 'Enhance your LinkedIn profile with strategic recommendations to increase visibility.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Code,
    title: 'GitHub Analysis',
    description: 'Showcase your coding skills with insights on your repositories and contributions.',
    color: 'from-gray-600 to-gray-700',
  },
  {
    icon: Globe,
    title: 'Portfolio Review',
    description: 'Get feedback on your portfolio website with SEO and design recommendations.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Zap,
    title: 'AI Career Coach',
    description: 'Get personalized career advice and guidance from our advanced AI assistant.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Smart Job Matching',
    description: 'Find jobs that match your skills with our intelligent recommendation engine.',
    color: 'from-emerald-500 to-emerald-600',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accelerate your career growth and land your dream job.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.title} variants={item}>
                <Card className="p-6 hover:border-accent/50 transition-all hover:shadow-lg group cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
