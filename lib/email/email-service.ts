import { Resend } from 'resend'
import { ResumeAnalysisEmail } from './templates/resume-analysis-email'
import { JobMatchEmail } from './templates/job-match-email'
import { WeeklyDigestEmail } from './templates/weekly-digest-email'

const resend = new Resend(process.env.RESEND_API_KEY || 'test-key')

export const emailService = {
  /**
   * Send resume analysis notification
   */
  async sendResumeAnalysis(
    email: string,
    data: {
      userName: string
      resumeName: string
      overallScore: number
      topStrengths: string[]
      keyImprovements: string[]
      analysisUrl: string
    }
  ) {
    try {
      const result = await resend.emails.send({
        from: 'CareerPilot AI <notifications@careerpilot.ai>',
        to: email,
        subject: `Your Resume Analysis is Ready - Score: ${data.overallScore}/100`,
        react: ResumeAnalysisEmail(data),
      })

      if (result.error) {
        console.error('[v0] Resume analysis email error:', result.error)
        return { success: false, error: result.error }
      }

      console.log('[v0] Resume analysis email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('[v0] Resume analysis email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send job match notification
   */
  async sendJobMatch(
    email: string,
    data: {
      userName: string
      jobTitle: string
      company: string
      matchScore: number
      matchReasons: string[]
      jobUrl: string
    }
  ) {
    try {
      const result = await resend.emails.send({
        from: 'CareerPilot AI <notifications@careerpilot.ai>',
        to: email,
        subject: `New Job Match: ${data.jobTitle} at ${data.company}`,
        react: JobMatchEmail(data),
      })

      if (result.error) {
        console.error('[v0] Job match email error:', result.error)
        return { success: false, error: result.error }
      }

      console.log('[v0] Job match email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('[v0] Job match email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send weekly digest
   */
  async sendWeeklyDigest(
    email: string,
    data: {
      userName: string
      newResumeScore?: number
      jobMatches: number
      careerTipTitle: string
      careerTipContent: string
      dashboardUrl: string
    }
  ) {
    try {
      const result = await resend.emails.send({
        from: 'CareerPilot AI <digest@careerpilot.ai>',
        to: email,
        subject: 'Your Weekly CareerPilot Digest',
        react: WeeklyDigestEmail(data),
      })

      if (result.error) {
        console.error('[v0] Weekly digest email error:', result.error)
        return { success: false, error: result.error }
      }

      console.log('[v0] Weekly digest email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('[v0] Weekly digest email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send generic email notification
   */
  async sendGenericNotification(
    email: string,
    data: {
      subject: string
      title: string
      message: string
      actionUrl?: string
      actionLabel?: string
    }
  ) {
    try {
      const result = await resend.emails.send({
        from: 'CareerPilot AI <notifications@careerpilot.ai>',
        to: email,
        subject: data.subject,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px;">
                <h2 style="color: #1f2937; margin: 0 0 16px 0;">${data.title}</h2>
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">${data.message}</p>
                ${
                  data.actionUrl
                    ? `<a href="${data.actionUrl}" style="background-color: #6366f1; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">${data.actionLabel || 'View More'}</a>`
                    : ''
                }
              </div>
            </body>
          </html>
        `,
      })

      if (result.error) {
        console.error('[v0] Generic notification email error:', result.error)
        return { success: false, error: result.error }
      }

      console.log('[v0] Generic notification email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('[v0] Generic notification email exception:', error)
      return { success: false, error }
    }
  },
}
