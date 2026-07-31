import { NextRequest, NextResponse } from 'next/server'
import { sendWeeklyDigests } from '@/lib/cron/email-jobs'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify this is a Vercel cron request
  // CRON_SECRET should be set in production for security
  // In development, it can be omitted for testing
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await sendWeeklyDigests()
    return NextResponse.json({
      success: true,
      message: `Weekly digests sent to ${result.sent} users`,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('[v0] Cron error:', error)
    return NextResponse.json(
      { error: 'Failed to send digests' },
      { status: 500 }
    )
  }
}
