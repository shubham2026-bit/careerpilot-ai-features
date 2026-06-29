import { RegisterForm } from '@/components/auth/register-form'

export const metadata = {
  title: 'Sign Up - CareerPilot AI',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterForm />
    </div>
  )
}
