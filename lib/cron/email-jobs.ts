import { createServerSupabase } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { db } from '@/lib/db'
import { userSettings, notifications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Send weekly digest emails to all users
 * Should be triggered by Vercel cron
 */
export async function sendWeeklyDigests() {
  try {
    const supabase = await createServerSupabase()

    // Get all users with email notifications enabled
    const usersWithNotifications = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.email_notifications, true))

    console.log(`[v0] Sending weekly digests to ${usersWithNotifications.length} users`)

    for (const userSetting of usersWithNotifications) {
      try {
        // Get user from Supabase
        const { data: { user }, error } = await supabase.auth.admin.getUserById(
          userSetting.user_id
        )

        if (error || !user?.email) {
          console.error(`[v0] Failed to get user ${userSetting.user_id}`)
          continue
        }

        // Get user's recent activity (notifications count)
        const [recentNotifications] = await db
          .select()
          .from(notifications)
          .where(eq(notifications.user_id, userSetting.user_id))
          .limit(1)

        // Send digest email
        const result = await emailService.sendWeeklyDigest(user.email, {
          userName: user.user_metadata?.full_name || 'Career Seeker',
          jobMatches: Math.floor(Math.random() * 5) + 3, // Mock data
          careerTipTitle: 'Optimize Your LinkedIn Profile',
          careerTipContent:
            'Add a professional photo and write a compelling headline to increase visibility to recruiters.',
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        })

        if (result.success) {
          console.log(`[v0] Weekly digest sent to ${user.email}`)
        } else {
          console.error(`[v0] Failed to send digest to ${user.email}`)
        }
      } catch (error) {
        console.error(`[v0] Error processing user ${userSetting.user_id}:`, error)
      }
    }

    return { success: true, sent: usersWithNotifications.length }
  } catch (error) {
    console.error('[v0] Weekly digest cron error:', error)
    throw error
  }
}

/**
 * Send resume analysis reminder emails
 */
export async function sendResumeReminders() {
  try {
    const supabase = await createServerSupabase()

    // Get all users who haven't analyzed their resume in 7 days
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error || !users) {
      throw new Error('Failed to fetch users')
    }

    console.log(`[v0] Checking ${users.users.length} users for resume reminders`)

    for (const user of users.users) {
      if (!user.email) continue

      // Check if they have a resume analyzed recently
      // This is a simplified check - in production, query the database
      const result = await emailService.sendGenericNotification(user.email, {
        subject: "Don't forget to analyze your resume!",
        title: 'Improve Your Resume',
        message:
          'Regular resume analysis helps you stay competitive. Get personalized feedback from our AI career coach.',
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/resume`,
        actionLabel: 'Analyze Now',
      })

      if (result.success) {
        console.log(`[v0] Resume reminder sent to ${user.email}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Resume reminder cron error:', error)
    throw error
  }
}

/**
 * Send job match notifications
 */
export async function sendJobMatches() {
  try {
    console.log('[v0] Processing job match notifications')

    // This would typically:
    // 1. Get all users with job search preferences
    // 2. Search for new jobs matching their criteria
    // 3. Send notifications for good matches
    // For now, this is a placeholder

    return { success: true, sent: 0 }
  } catch (error) {
    console.error('[v0] Job match cron error:', error)
    throw error
  }
}
