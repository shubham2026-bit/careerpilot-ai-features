import { NextRequest, NextResponse } from 'next/server'
import { sendResumeReminders } from '@/lib/cron/email-jobs'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify Vercel cron request
  // CRON_SECRET should be set in production for security
  // In development, it can be omitted for testing
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await sendResumeReminders()
    return NextResponse.json({
      success: true,
      message: 'Resume reminders sent',
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('[v0] Resume reminder cron error:', error)
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    )
  }
}
