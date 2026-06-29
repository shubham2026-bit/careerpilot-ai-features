# CareerPilot AI - Email Notifications Setup Guide

## Overview

CareerPilot AI includes a comprehensive email notification system powered by Resend, enabling automated alerts for resume analysis, job matches, and weekly digests.

## Setup Instructions

### 1. Get a Resend Account

1. Visit [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email
4. Go to the API Keys section and copy your API key

### 2. Add Environment Variable

Add your Resend API key to your `.env.local` file:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Also ensure you have:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Sender Email (Production)

When deploying to production, configure your sending domain in Resend:

1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `careerpilot.ai`)
3. Update email sender in code to use your domain

For development, Resend provides a `noreply@resend.dev` default domain.

## Email Templates

CareerPilot AI includes three main email templates:

### 1. Resume Analysis Email

Sent when a user uploads and analyzes a resume.

**Includes:**
- Overall score (0-100)
- Top strengths
- Key improvements needed
- Direct link to full analysis

**Trigger:** `sendResumeAnalysisEmail()`

### 2. Job Match Email

Sent when a job posting matches user's profile.

**Includes:**
- Job title and company
- Match percentage
- Why it's a good fit
- Direct link to job posting

**Trigger:** `sendJobMatchEmail()`

### 3. Weekly Digest Email

Sent once per week with career updates.

**Includes:**
- New resume score (if updated)
- Number of job matches
- Career tip or advice
- Dashboard link

**Trigger:** `sendWeeklyDigestEmail()`

## Implementation Examples

### Send Resume Analysis Email

```typescript
import { sendResumeAnalysisEmail } from '@/app/actions/email-notification-actions'

await sendResumeAnalysisEmail(
  'my-resume.pdf',
  85,
  ['Strong technical skills', 'Good formatting'],
  ['Add quantifiable metrics', 'Expand project descriptions']
)
```

### Send Job Match Email

```typescript
import { sendJobMatchEmail } from '@/app/actions/email-notification-actions'

await sendJobMatchEmail(
  'Senior Frontend Engineer',
  'Tech Company Inc',
  92,
  ['Perfect tech stack match', 'Experience aligns with requirements'],
  'https://jobs.example.com/senior-frontend'
)
```

### Send Weekly Digest

```typescript
import { sendWeeklyDigestEmail } from '@/app/actions/email-notification-actions'

await sendWeeklyDigestEmail({
  newResumeScore: 88,
  jobMatches: 5,
  careerTipTitle: 'How to Nail Behavioral Interviews',
  careerTipContent: 'Use the STAR method to structure your responses...'
})
```

## User Preferences

Users can control email notifications in Settings:

- **Email Notifications**: General notification toggle
- **Career Tips**: Receive career advice emails
- **Job Alerts**: Receive job match notifications
- **Weekly Digest**: Receive weekly summary emails

All email functions automatically check these preferences before sending.

## Testing in Development

### Test with Resend Test Mode

```typescript
// Use test API key for development
RESEND_API_KEY=re_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### View Sent Emails

1. Go to Resend Dashboard → Emails
2. All sent emails appear in your dashboard
3. Preview HTML and check delivery status

### Test Without API Key

During development, if you don't have a Resend account yet:

1. The email functions will log to console
2. Check `/vercel/share/v0-project/user_read_only_context/v0_debug_logs.log` for test output
3. Get a real API key before production deployment

## Email Service Architecture

### Email Service (`lib/email/email-service.ts`)

Core utility that handles all email sending:

```typescript
emailService.sendResumeAnalysis(email, data)
emailService.sendJobMatch(email, data)
emailService.sendWeeklyDigest(email, data)
emailService.sendGenericNotification(email, data)
```

### Email Actions (`app/actions/email-notification-actions.ts`)

Server actions that:

1. Authenticate the user
2. Check their email preferences
3. Send via email service
4. Create notification records in database

### Email Templates (`lib/email/templates/`)

React Email components for:

- `resume-analysis-email.tsx`
- `job-match-email.tsx`
- `weekly-digest-email.tsx`

## Best Practices

1. **Always check user preferences** - All send functions validate settings before sending
2. **Use meaningful data** - Include specific scores, titles, and reasons
3. **Handle errors gracefully** - Wrap calls in try-catch
4. **Log for debugging** - All functions log with `[v0]` prefix
5. **Test before deployment** - Use test API key first

## Troubleshooting

### "Missing API Key" Error

Solution: Add `RESEND_API_KEY` to `.env.local`

### Emails Not Sending

Check:

1. User preferences are enabled
2. User email is valid
3. API key is correct
4. Check console logs for errors

### Emails Going to Spam

- Add sender domain in Resend
- Configure SPF/DKIM records
- Use consistent sender email

## Production Deployment

1. Add `RESEND_API_KEY` to Vercel environment variables
2. Configure production domain in Resend
3. Update email sender addresses
4. Update `NEXT_PUBLIC_APP_URL` to production URL
5. Deploy and test with real email

## Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Components](https://react.email/)
- [Email Best Practices](https://resend.com/blog)

## Support

For issues with:

- **Resend integration**: Check Resend dashboard → logs
- **Email templates**: Review React Email docs
- **Database integration**: Check schema in `lib/db/schema.ts`
