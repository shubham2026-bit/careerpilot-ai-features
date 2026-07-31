import nodemailer from 'nodemailer'

// Brevo SMTP Configuration
const BREVO_SMTP_HOST = 'smtp-relay.brevo.com'
const BREVO_SMTP_PORT = 587

// Create Brevo transporter
function createBrevoTransporter() {
  if (!process.env.BREVO_API_KEY) {
    console.error('[v0] BREVO_API_KEY not set. Email functionality disabled.')
    return null
  }

  return nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: BREVO_SMTP_PORT,
    secure: false, // Use TLS
    auth: {
      user: 'noreply@careerpilot.ai', // Brevo verified sender email
      pass: process.env.BREVO_API_KEY, // Brevo API Key as SMTP password
    },
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createBrevoTransporter()
    if (!transporter) {
      console.error('[v0] Brevo transporter not initialized')
      return false
    }

    const result = await transporter.sendMail({
      from: 'noreply@careerpilot.ai',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    })

    console.log('[v0] Email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('[v0] Email send failed:', error)
    return false
  }
}

// Email Templates

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to CareerPilot AI, ${userName}!</h1>
      <p>We're excited to have you join us. CareerPilot AI is here to help you:</p>
      <ul>
        <li>📊 Analyze your resume and LinkedIn profile</li>
        <li>🔍 Find job opportunities tailored to your skills</li>
        <li>🚀 Get AI-powered career coaching</li>
        <li>💼 Build and showcase your portfolio</li>
      </ul>
      <p><strong>Get started now:</strong> Complete your profile and upload your resume to unlock all features.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Welcome to CareerPilot AI',
    html,
  })
}

export async function sendResumeAnalysisEmail(
  userEmail: string,
  userName: string,
  analysis: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Your Resume Analysis is Ready!</h1>
      <p>Hi ${userName},</p>
      <p>We've analyzed your resume. Here are our findings:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        ${analysis}
      </div>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/resume" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Analysis</a>
      </p>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Your Resume Analysis from CareerPilot AI',
    html,
  })
}

export async function sendJobRecommendationsEmail(
  userEmail: string,
  userName: string,
  jobCount: number
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>New Job Recommendations for You!</h1>
      <p>Hi ${userName},</p>
      <p>We found <strong>${jobCount} new job opportunities</strong> matching your profile and skills.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/jobs" style="background-color: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Browse Job Opportunities</a>
      </p>
      <p>These jobs match your:</p>
      <ul>
        <li>Experience level</li>
        <li>Skills and expertise</li>
        <li>Preferred location</li>
        <li>Career goals</li>
      </ul>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: `${jobCount} New Jobs Matching Your Profile - CareerPilot AI`,
    html,
  })
}

export async function sendWeeklyDigestEmail(
  userEmail: string,
  userName: string,
  digestData: {
    newJobs: number
    completedActions: number
    profileStrength: number
  }
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Your Weekly CareerPilot Summary</h1>
      <p>Hi ${userName},</p>
      <p>Here's what happened this week:</p>
      <table style="width: 100%; margin: 20px 0;">
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px;"><strong>New Job Recommendations</strong></td>
          <td style="padding: 10px; text-align: right;"><strong>${digestData.newJobs}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>Actions Completed</strong></td>
          <td style="padding: 10px; text-align: right;"><strong>${digestData.completedActions}</strong></td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px;"><strong>Profile Strength</strong></td>
          <td style="padding: 10px; text-align: right;"><strong>${digestData.profileStrength}%</strong></td>
        </tr>
      </table>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Dashboard</a>
      </p>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Your Weekly CareerPilot Summary',
    html,
  })
}

export async function sendResumeReminderEmail(userEmail: string, userName: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Time to Update Your Resume!</h1>
      <p>Hi ${userName},</p>
      <p>We noticed it's been a while since you updated your resume. Keeping it fresh helps you:</p>
      <ul>
        <li>✅ Get more accurate AI analysis</li>
        <li>✅ Receive better job recommendations</li>
        <li>✅ Stay competitive in the job market</li>
      </ul>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/resume" style="background-color: #ffc107; color: black; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Update Your Resume</a>
      </p>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Time to Update Your Resume - CareerPilot AI',
    html,
  })
}
