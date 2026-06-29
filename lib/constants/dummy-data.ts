export const DASHBOARD_SCORES = {
  career: 78,
  ats: 85,
  linkedin: 72,
  github: 88,
  portfolio: 81,
  interview: 76,
  jobMatch: 82,
}

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'resume_upload',
    title: 'Resume uploaded',
    description: 'Updated_Resume_2024.pdf',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: 'upload',
  },
  {
    id: 2,
    type: 'analysis_complete',
    title: 'Resume analysis completed',
    description: 'Found 12 optimization opportunities',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: 'check',
  },
  {
    id: 3,
    type: 'linkedin_sync',
    title: 'LinkedIn profile synced',
    description: 'Profile updated with latest experience',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    icon: 'link',
  },
  {
    id: 4,
    type: 'job_match',
    title: 'New job matches found',
    description: '5 positions match your profile',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: 'briefcase',
  },
  {
    id: 5,
    type: 'milestone',
    title: 'Career milestone reached',
    description: 'You reached 80+ resume score!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    icon: 'star',
  },
]

export const CHART_DATA = {
  careerGrowth: [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 61 },
    { month: 'Apr', score: 58 },
    { month: 'May', score: 72 },
    { month: 'Jun', score: 78 },
  ],
  applications: [
    { week: 'Week 1', applications: 3 },
    { week: 'Week 2', applications: 5 },
    { week: 'Week 3', applications: 8 },
    { week: 'Week 4', applications: 6 },
    { week: 'Week 5', applications: 9 },
  ],
  skills: [
    { month: 'Jan', skills: 8 },
    { month: 'Feb', skills: 10 },
    { month: 'Mar', skills: 12 },
    { month: 'Apr', skills: 14 },
    { month: 'May', skills: 18 },
    { month: 'Jun', skills: 22 },
  ],
}

export const SAMPLE_RESUMES = [
  {
    id: 1,
    name: 'Senior_Product_Manager_Resume.pdf',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    score: 85,
    status: 'optimized',
  },
  {
    id: 2,
    name: 'Updated_Resume_2024.pdf',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    score: 78,
    status: 'needs-review',
  },
]

export const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Senior Product Manager',
    company: 'Tech Giants Inc',
    location: 'San Francisco, CA',
    matchScore: 92,
    salary: '$180k - $220k',
    description: 'Lead product strategy for our flagship platform',
  },
  {
    id: 2,
    title: 'Product Manager, AI',
    company: 'StartupXYZ',
    location: 'Remote',
    matchScore: 88,
    salary: '$150k - $200k',
    description: 'Shape the future of AI-powered products',
  },
  {
    id: 3,
    title: 'Director of Product',
    company: 'Enterprise Co',
    location: 'New York, NY',
    matchScore: 82,
    salary: '$200k - $250k',
    description: 'Oversee product vision for enterprise solutions',
  },
  {
    id: 4,
    title: 'Product Manager, Growth',
    company: 'FinTech Innovators',
    location: 'Remote',
    matchScore: 85,
    salary: '$160k - $210k',
    description: 'Drive user acquisition and engagement',
  },
]

export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'E-commerce Platform Redesign',
    description: 'Led complete redesign resulting in 40% increase in conversions',
    link: 'portfolio.example.com/project1',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    description: 'Built real-time analytics dashboard serving 50K+ users',
    link: 'portfolio.example.com/project2',
    technologies: ['React', 'D3.js', 'Python'],
  },
  {
    id: 3,
    title: 'Mobile App Launch',
    description: 'Shipped iOS app that reached #1 in category',
    link: 'portfolio.example.com/project3',
    technologies: ['Swift', 'Firebase', 'Figma'],
  },
]

export const GITHUB_STATS = {
  contributions: 1250,
  publicRepos: 28,
  followers: 342,
  topLanguages: [
    { name: 'TypeScript', percentage: 45 },
    { name: 'Python', percentage: 25 },
    { name: 'JavaScript', percentage: 20 },
    { name: 'Rust', percentage: 10 },
  ],
}

export const LINKEDIN_INSIGHTS = {
  profileViews: 245,
  searchAppearances: 1250,
  engagementRate: 8.5,
  recommendations: 12,
  endorsements: 45,
  connectionsCount: 850,
}

export const NOTIFICATIONS_LIST = [
  {
    id: 1,
    type: 'success',
    title: 'Resume analyzed successfully',
    message: 'Your resume has been analyzed. Score improved by 5 points!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'New job match found',
    message: 'Senior Product Manager role matches your profile',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Profile update recommended',
    message: 'Your LinkedIn profile is missing key skills',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Subscription active',
    message: 'Your Pro plan is active until June 2025',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
]
