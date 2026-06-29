import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In - CareerPilot AI',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  )
}
