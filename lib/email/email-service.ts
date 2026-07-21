import { render } from '@react-email/render'
import { ResumeAnalysisEmail } from './templates/resume-analysis-email'
import { JobMatchEmail } from './templates/job-match-email'
import { WeeklyDigestEmail } from './templates/weekly-digest-email'

// Use BREVO_API_KEY or SENDINBLUE_API_TOKEN for Brevo API
const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_TOKEN
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@careerpilot.ai'

export const emailService = {
  /**
   * Send resume analysis notification via Brevo
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
      const htmlContent = await render(ResumeAnalysisEmail(data))
      return sendViaBrevo({
        to: [{ email, name: data.userName }],
        subject: `Your Resume Analysis is Ready - Score: ${data.overallScore}/100`,
        htmlContent,
      })
    } catch (error) {
      console.error('[v0] Resume analysis email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send job match notification via Brevo
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
      const htmlContent = await render(JobMatchEmail(data))
      return sendViaBrevo({
        to: [{ email, name: data.userName }],
        subject: `New Job Match: ${data.jobTitle} at ${data.company}`,
        htmlContent,
      })
    } catch (error) {
      console.error('[v0] Job match email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send weekly digest via Brevo
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
      const htmlContent = await render(WeeklyDigestEmail(data))
      return sendViaBrevo({
        to: [{ email, name: data.userName }],
        subject: 'Your Weekly CareerPilot Digest',
        htmlContent,
      })
    } catch (error) {
      console.error('[v0] Weekly digest email exception:', error)
      return { success: false, error }
    }
  },

  /**
   * Send generic email notification via Brevo
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
      const htmlContent = `
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
      `
      return sendViaBrevo({
        to: [{ email }],
        subject: data.subject,
        htmlContent,
      })
    } catch (error) {
      console.error('[v0] Generic notification email exception:', error)
      return { success: false, error }
    }
  },
}

/**
 * Internal function to send emails via Brevo API
 */
async function sendViaBrevo(
  params: {
    to: Array<{ email: string; name?: string }>
    subject: string
    htmlContent: string
  }
): Promise<{ success: boolean; messageId?: string; error?: any }> {
  if (!BREVO_API_KEY) {
    console.error('[v0] BREVO_API_KEY or SENDINBLUE_API_TOKEN not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        sender: { email: EMAIL_FROM, name: 'CareerPilot AI' },
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] Brevo API error:', errorData)
      return { success: false, error: errorData }
    }

    const result = await response.json()
    console.log('[v0] Email sent successfully via Brevo:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('[v0] Brevo API exception:', error)
    return { success: false, error }
  }
}
