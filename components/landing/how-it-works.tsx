'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your free CareerPilot account in seconds.',
  },
  {
    number: '02',
    title: 'Connect Your Profiles',
    description: 'Link your resume, LinkedIn, GitHub, and portfolio.',
  },
  {
    number: '03',
    title: 'Get AI Insights',
    description: 'Receive detailed analysis and personalized recommendations.',
  },
  {
    number: '04',
    title: 'Improve & Track',
    description: 'Implement suggestions and track your career growth.',
  },
  {
    number: '05',
    title: 'Find Opportunities',
    description: 'Discover jobs that match your updated profile.',
  },
  {
    number: '06',
    title: 'Land Your Dream Job',
    description: 'Use insights to ace interviews and land positions.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and transform your career in weeks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 relative h-full">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
