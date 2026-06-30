'use server'

import { emailService } from '@/lib/email/email-service'
import { getUserId, createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { notifications, userSettings } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

/**
 * Send resume analysis email notification
 */
export async function sendResumeAnalysisEmail(
  resumeFileName: string,
  overallScore: number,
  topStrengths: string[],
  keyImprovements: string[]
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const userId = user.id
    const userEmail = user.email

    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Check user settings
    const userSettingsRecord = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    const settings = userSettingsRecord[0]
    if (settings && !settings.emailNotifications) {
      console.log('[v0] Email notifications disabled for user', userId)
      return { success: false, reason: 'Email notifications disabled' }
    }

    // Send email
    const analysisUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/resume`
    const result = await emailService.sendResumeAnalysis(userEmail, {
      userName: userEmail.split('@')[0] || 'User',
      resumeName: resumeFileName,
      overallScore,
      topStrengths,
      keyImprovements,
      analysisUrl,
    })

    if (result.success) {
      // Create notification record
      const notificationId = uuid()
      await db.insert(notifications).values({
        id: notificationId,
        userId,
        type: 'resume_analysis',
        title: 'Resume Analysis Complete',
        message: `Your resume "${resumeFileName}" has been analyzed with a score of ${overallScore}/100`,
        icon: 'FileText',
        color: 'indigo',
        actionUrl: analysisUrl,
        actionLabel: 'View Analysis',
        metadata: {
          resumeFileName,
          overallScore,
          messageId: result.messageId,
        },
      })

      console.log('[v0] Resume analysis email notification created:', notificationId)
    }

    return result
  } catch (error) {
    console.error('[v0] Resume analysis email error:', error)
    throw error
  }
}

/**
 * Send job match email notification
 */
export async function sendJobMatchEmail(
  jobTitle: string,
  company: string,
  matchScore: number,
  matchReasons: string[],
  jobUrl: string
) {
  try {
    const session = await auth.api.getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id
    const userEmail = session.user.email

    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Check user settings
    const userSettingsRecord = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    const settings = userSettingsRecord[0]
    if (settings && !settings.jobAlerts) {
      console.log('[v0] Job alerts disabled for user', userId)
      return { success: false, reason: 'Job alerts disabled' }
    }

    // Send email
    const result = await emailService.sendJobMatch(userEmail, {
      userName: session.user.name || 'User',
      jobTitle,
      company,
      matchScore,
      matchReasons,
      jobUrl,
    })

    if (result.success) {
      // Create notification record
      const notificationId = uuid()
      await db.insert(notifications).values({
        id: notificationId,
        userId,
        type: 'job_match',
        title: `New Job Match: ${jobTitle}`,
        message: `${company} is looking for a ${jobTitle} with a ${matchScore}% match to your profile`,
        icon: 'Briefcase',
        color: 'green',
        actionUrl: jobUrl,
        actionLabel: 'View Job',
        metadata: {
          jobTitle,
          company,
          matchScore,
          messageId: result.messageId,
        },
      })

      console.log('[v0] Job match email notification created:', notificationId)
    }

    return result
  } catch (error) {
    console.error('[v0] Job match email error:', error)
    throw error
  }
}

/**
 * Send weekly digest email
 */
export async function sendWeeklyDigestEmail(data: {
  newResumeScore?: number
  jobMatches: number
  careerTipTitle: string
  careerTipContent: string
}) {
  try {
    const session = await auth.api.getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id
    const userEmail = session.user.email

    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Check user settings
    const userSettingsRecord = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    const settings = userSettingsRecord[0]
    if (settings && !settings.weeklyDigest) {
      console.log('[v0] Weekly digest disabled for user', userId)
      return { success: false, reason: 'Weekly digest disabled' }
    }

    // Send email
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/analytics`
    const result = await emailService.sendWeeklyDigest(userEmail, {
      userName: session.user.name || 'User',
      newResumeScore: data.newResumeScore,
      jobMatches: data.jobMatches,
      careerTipTitle: data.careerTipTitle,
      careerTipContent: data.careerTipContent,
      dashboardUrl,
    })

    if (result.success) {
      // Create notification record
      const notificationId = uuid()
      await db.insert(notifications).values({
        id: notificationId,
        userId,
        type: 'weekly_digest',
        title: 'Your Weekly CareerPilot Digest',
        message: `${data.jobMatches} new job matches and career insights`,
        icon: 'Mail',
        color: 'blue',
        actionUrl: dashboardUrl,
        actionLabel: 'View Dashboard',
        metadata: {
          ...data,
          messageId: result.messageId,
        },
      })

      console.log('[v0] Weekly digest email notification created:', notificationId)
    }

    return result
  } catch (error) {
    console.error('[v0] Weekly digest email error:', error)
    throw error
  }
}

/**
 * Send generic email notification
 */
export async function sendGenericEmail(subject: string, title: string, message: string, actionUrl?: string, actionLabel?: string) {
  try {
    const session = await auth.api.getSession()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id
    const userEmail = session.user.email

    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Check user settings
    const userSettingsRecord = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    const settings = userSettingsRecord[0]
    if (settings && !settings.emailNotifications) {
      console.log('[v0] Email notifications disabled for user', userId)
      return { success: false, reason: 'Email notifications disabled' }
    }

    // Send email
    const result = await emailService.sendGenericNotification(userEmail, {
      subject,
      title,
      message,
      actionUrl,
      actionLabel,
    })

    return result
  } catch (error) {
    console.error('[v0] Generic email error:', error)
    throw error
  }
}
