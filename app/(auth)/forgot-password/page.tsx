import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata = {
  title: 'Forgot Password - CareerPilot AI',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ForgotPasswordForm />
    </div>
  )
}
