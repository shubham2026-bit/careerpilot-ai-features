'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useNotification } from '@/providers/notification-provider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Loader2 } from 'lucide-react'

export function EmailVerification() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { addNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      addNotification({
        type: 'success',
        title: 'Email verified!',
        message: 'Your email has been verified successfully.',
      })
      router.push('/dashboard')
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Verification failed',
        message: 'Invalid verification code. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-indigo-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Email</h1>
          <p className="text-muted-foreground">Enter the verification code sent to your email</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Verification Code</label>
            <input
              placeholder="000000"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:shadow-lg group"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button className="text-accent font-semibold hover:underline">Resend</button>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
