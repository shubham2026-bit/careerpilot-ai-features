import { EmailVerification } from '@/components/auth/email-verification'

export const metadata = {
  title: 'Verify Email - CareerPilot AI',
  description: 'Verify your email address',
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <EmailVerification />
    </div>
  )
}
