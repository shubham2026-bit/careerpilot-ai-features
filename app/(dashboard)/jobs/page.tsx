'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, MapPin, DollarSign, TrendingUp } from 'lucide-react'
import { SAMPLE_JOBS } from '@/lib/constants/dummy-data'

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Job Matches</h1>
        <p className="text-muted-foreground">Opportunities tailored to your profile</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
        {['All', 'Remote', 'Senior', 'Startup', 'Enterprise'].map((filter) => (
          <Button
            key={filter}
            variant={filter === 'All' ? 'default' : 'outline'}
            className={filter === 'All' ? 'bg-gradient-primary' : ''}
          >
            {filter}
          </Button>
        ))}
      </motion.div>

      {/* Job Listings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {SAMPLE_JOBS.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:border-accent/50 transition-all group cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <TrendingUp size={16} />
                      {job.matchScore}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{job.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary">View Details</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
