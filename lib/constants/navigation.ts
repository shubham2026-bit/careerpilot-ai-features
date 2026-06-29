import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Code,
  Globe,
  Briefcase as Jobs,
  Wand2,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Resume',
    href: '/dashboard/resume',
    icon: FileText,
  },
  {
    label: 'LinkedIn',
    href: '/dashboard/linkedin',
    icon: Briefcase,
  },
  {
    label: 'GitHub',
    href: '/dashboard/github',
    icon: Code,
  },
  {
    label: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: Globe,
  },
  {
    label: 'Jobs',
    href: '/dashboard/jobs',
    icon: Jobs,
  },
  {
    label: 'Career Coach',
    href: '/dashboard/career-coach',
    icon: Wand2,
  },
]

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    label: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
]

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '1 Resume analysis per month',
      'Basic LinkedIn insights',
      'Limited job matches',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For active job seekers',
    features: [
      'Unlimited resume analysis',
      'Advanced LinkedIn insights',
      'AI career coaching',
      'Portfolio analysis',
      'Priority support',
      'Job match recommendations',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations',
    features: [
      'Everything in Pro',
      'Team accounts',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'SSO & security features',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const FAQ_ITEMS = [
  {
    question: 'How does CareerPilot analyze my resume?',
    answer:
      'CareerPilot uses advanced AI to scan your resume for ATS compatibility, keyword optimization, and content quality. It provides actionable suggestions to improve your chances of getting interviews.',
  },
  {
    question: 'Can I connect multiple LinkedIn profiles?',
    answer:
      'Currently, you can connect one LinkedIn profile per account. We&apos;re working on multi-profile support for the Pro plan.',
  },
  {
    question: 'How often should I update my profile?',
    answer:
      'We recommend updating your profile whenever you make significant changes to your resume, skills, or experience. This helps us provide more accurate job recommendations.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we use industry-standard encryption and never sell your data. Your information is only used to provide personalized career insights.',
  },
  {
    question: 'Can I export my analysis reports?',
    answer:
      'Pro users can export detailed PDF reports of their resume analysis and career insights. Free users can view reports online.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. Subscriptions auto-renew monthly or annually.',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Senior Product Manager',
    company: 'Tech Startup',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    quote:
      'CareerPilot helped me optimize my resume and I landed interviews at top companies within weeks. The AI insights were incredibly valuable.',
  },
  {
    name: 'Michael Chen',
    role: 'Full Stack Developer',
    company: 'Fortune 500',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    quote:
      'The career coaching feature is like having a personal mentor. It guided me through a successful career transition.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Design Agency',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    quote:
      'The portfolio analysis tool helped me showcase my best work to potential employers. Highly recommended!',
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'AI Lab',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    quote:
      'Finally, a tool that understands tech careers. The job matching algorithm is spot-on.',
  },
]
