import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { userAnalytics, resumes, notifications } from '@/lib/db/schema'
import { count } from 'drizzle-orm'
import { verifyAdminAccess } from '@/lib/auth/admin'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    // CRITICAL: Verify admin access before proceeding
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const supabase = await createServerSupabase()

    // Get user count
    const { data: users } = await supabase.auth.admin.listUsers()
    const totalUsers = users?.users.length || 0

    // Get resume count
    const resumeCount = await db
      .select({ count: count() })
      .from(resumes)

    // Get notification count
    const notificationCount = await db
      .select({ count: count() })
      .from(notifications)

    // Get analytics events
    const analyticsCount = await db
      .select({ count: count() })
      .from(userAnalytics)

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes: resumeCount[0]?.count || 0,
        totalNotifications: notificationCount[0]?.count || 0,
        totalAnalyticsEvents: analyticsCount[0]?.count || 0,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error('[v0] Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
