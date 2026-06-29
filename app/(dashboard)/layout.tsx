import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard - CareerPilot AI',
  description: 'Manage your career with AI-powered insights',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
