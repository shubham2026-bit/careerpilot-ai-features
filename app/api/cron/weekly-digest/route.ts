import { NextRequest, NextResponse } from 'next/server'
import { sendWeeklyDigests } from '@/lib/cron/email-jobs'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify this is a Vercel cron request
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
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
