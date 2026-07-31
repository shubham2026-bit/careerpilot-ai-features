# Environment Variables Reference - CareerPilot AI

## Quick Copy-Paste Format

Add these to your Vercel Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_APP_URL=https://v0-careerpilott.vercel.app/
NEXT_PUBLIC_SUPABASE_URL=https://njoghcklnnskzlxklfrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BREVO_API_KEY=xkeysib-BREVO_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY=AQ.Ab8RN6LxH8EzdQa6xb7OMZXTn_DGQsUOdKhdNEcY6FciQZPKjw
GITHUB_OAUTH_CLIENT_ID=Ov23liLqD90UyqtYNxhC
GITHUB_OAUTH_CLIENT_SECRET=<your-github-secret>
LINKEDIN_OAUTH_CLIENT_ID=868pox7pyjcd8e
LINKEDIN_OAUTH_CLIENT_SECRET=WPL_AP1.TCwA9gTxrjuG5JMO.MqwJeQ==
CRON_SECRET=<generate-a-random-secret>
```

## Complete Variable Guide

| Variable | Value | Where to Get | Required |
|----------|-------|--------------|----------|
| **NEXT_PUBLIC_APP_URL** | `https://v0-careerpilott.vercel.app/` | Your app domain | ✅ Yes |
| **NEXT_PUBLIC_SUPABASE_URL** | `https://njoghcklnnskzlxklfrx.supabase.co` | Supabase project settings | ✅ Yes |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Your anon key | Supabase project → API settings | ✅ Yes |
| **SUPABASE_SERVICE_ROLE_KEY** | Your service role key | Supabase project → API settings | ✅ Yes |
| **BREVO_API_KEY** | `xkeysib-...` | Brevo dashboard → SMTP & API | ✅ Yes |
| **GOOGLE_GENERATIVE_AI_API_KEY** | `AIza...` | Google Cloud Console → API keys | ✅ Yes |
| **GITHUB_OAUTH_CLIENT_ID** | `Ov23liLqD90UyqtYNxhC` | GitHub Settings → Developer settings | ✅ Yes |
| **GITHUB_OAUTH_CLIENT_SECRET** | Your secret | GitHub Settings → Developer settings | ✅ Yes |
| **LINKEDIN_OAUTH_CLIENT_ID** | `868pox7pyjcd8e` | LinkedIn Developers → My apps | ✅ Yes |
| **LINKEDIN_OAUTH_CLIENT_SECRET** | `WPL_AP1...` | LinkedIn Developers → My apps | ✅ Yes |
| **CRON_SECRET** | Random string | Generate: `openssl rand -base64 32` | ⚠️ Dev only |

## How to Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable one by one:
   - Key: `NEXT_PUBLIC_APP_URL`
   - Value: `https://v0-careerpilott.vercel.app/`
   - Click **Add**
5. Repeat for all variables
6. Click **Save and Redeploy**

## Local Development (.env.development.local)

Create `.env.development.local` in project root with all variables. This file is gitignored.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://njoghcklnnskzlxklfrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-key-here
BREVO_API_KEY=your-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
GITHUB_OAUTH_CLIENT_ID=your-id-here
GITHUB_OAUTH_CLIENT_SECRET=your-secret-here
LINKEDIN_OAUTH_CLIENT_ID=your-id-here
LINKEDIN_OAUTH_CLIENT_SECRET=your-secret-here
CRON_SECRET=your-secret-here
```

## Verification

After setting all variables, verify in your app:

```bash
# Check if variables are loaded
pnpm dev

# Look for console messages like:
# [v0] Email send successfully: <message-id>
# This means BREVO_API_KEY is working

# Test in browser:
# 1. Sign up with test email
# 2. Check if welcome email is sent
# 3. Check if you can log in
```

## Security Notes

⚠️ **NEVER commit `.env` files to Git**
⚠️ **Keep these keys SECRET**
⚠️ **Regenerate if accidentally exposed**
⚠️ **Use different keys for dev/staging/production**

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL not found"
- ✅ Add to Vercel Environment Variables
- ✅ Redeploy after adding
- ✅ Check for typos in variable name

### "BREVO_API_KEY is undefined"
- ✅ Add `BREVO_API_KEY` to environment
- ✅ Verify sender email in Brevo
- ✅ Check Brevo account is active

### "GitHub OAuth not working"
- ✅ Add `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`
- ✅ Set redirect URL in GitHub app settings
- ✅ Verify app is not revoked

---

**Status**: ✅ All variables configured
**Last Updated**: 2024
