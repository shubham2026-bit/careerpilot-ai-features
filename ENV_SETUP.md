# Environment Variables Setup Guide

## Complete List of Required Environment Variables

### 1. DATABASE (Required)
```
DATABASE_URL=postgresql://user:password@host:5432/careerpilot
```
- **Get from**: Neon PostgreSQL
- **How**: Create a database at neon.tech, copy connection string
- **Important**: Use connection pooling URL for production

### 2. AUTHENTICATION (Required)
```
BETTER_AUTH_SECRET=your_random_secret_key_here
```
- **Get from**: Generate one yourself
- **How**: Run: `openssl rand -base64 32`
- **Important**: Keep this secret! Never commit to git

### 3. EMAIL SERVICE (Required for email notifications)
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxx
```
- **Get from**: Resend Dashboard (resend.com)
- **How**: 
  1. Sign up at resend.com (free tier available)
  2. Go to API Keys section
  3. Create API key
  4. Copy and paste
- **Important**: Email features won't work without this

### 4. AI GATEWAY (Optional - for AI features)
```
AI_GATEWAY_API_KEY=optional_if_using_non_gateway_providers
```
- **Status**: Not needed! Uses Vercel AI Gateway by default (zero-config)
- **Only needed if**: Using xAI, Groq, or Deep Infra
- **Cost**: Free tier available with Vercel

### 5. APP URL (Auto-configured on Vercel, needed for local dev)
```
BETTER_AUTH_URL=http://localhost:3000
```
- **Local development**: Set to `http://localhost:3000`
- **Production on Vercel**: Auto-set by Vercel (no action needed)
- **Custom domain**: Set to your domain, e.g., `https://careerpilot.com`

---

## Step-by-Step Setup for New Vercel Account

### Step 1: Create Database (Neon)
1. Go to neon.tech
2. Sign up or login
3. Create new project
4. Copy connection string (looks like: `postgresql://...`)
5. **Replace** `password` with your actual password from Neon

**Example:**
```
DATABASE_URL=postgresql://careerpilot_user:your_password@ep-calm-lake-123456.us-east-1.neon.tech/careerpilot?sslmode=require
```

### Step 2: Generate Auth Secret
Run this in your terminal:
```bash
openssl rand -base64 32
```
Copy the output - this is your `BETTER_AUTH_SECRET`

**Example output:**
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abc=
```

### Step 3: Setup Email (Resend)
1. Go to resend.com
2. Click "Sign up" (free)
3. Verify your email
4. Go to API Keys
5. Copy your API key (starts with `re_`)

**Example:**
```
RESEND_API_KEY=re_abc123def456ghi789
```

### Step 4: Add to Vercel
1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add each variable one by one:
   - `DATABASE_URL` = [from Neon]
   - `BETTER_AUTH_SECRET` = [generated]
   - `RESEND_API_KEY` = [from Resend]
   - `BETTER_AUTH_URL` = `https://your-domain.vercel.app` (or your custom domain)

### Step 5: Deploy
1. Push to GitHub
2. Vercel auto-deploys
3. Wait for build to complete
4. Open your app

---

## Local Development Setup

### .env.local Template
Create a `.env.local` file in project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/careerpilot

# Auth
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=re_your_api_key_here

# App
NODE_ENV=development
```

### Local Setup Steps
1. Copy template above into `.env.local`
2. Get `DATABASE_URL` from Neon
3. Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
4. Get `RESEND_API_KEY` from Resend
5. Run: `pnpm dev`

---

## Testing Email Locally

### Test Resume Analysis Email
```bash
# In Node shell or create a test file
import { sendResumeAnalysisEmail } from '@/lib/email/email-service'

await sendResumeAnalysisEmail({
  email: 'your-email@example.com',
  name: 'Test User',
  score: 78,
  strengths: ['Clear formatting', 'Good experience'],
  improvements: ['Add skills section', 'Expand summary'],
  analysisUrl: 'http://localhost:3000/resume/analysis'
})
```

### Email Testing with Resend
Resend provides a test mode for development:
1. Use any email address for testing
2. Emails go to Resend dashboard
3. View them in Resend console before going to production

---

## Checklist: Is Everything Configured?

### Code-Level Configuration
- ✅ Database schema: Ready (13 tables)
- ✅ Auth setup: Ready (Better Auth configured)
- ✅ Email templates: Ready (3 templates included)
- ✅ AI integration: Ready (Vercel AI Gateway)
- ✅ API routes: Ready (chat endpoint)
- ✅ Server actions: Ready (30+ actions)
- ✅ Components: Ready (all pages built)

### What YOU Need to Do
- ⚠️ Create Neon database account → Get DATABASE_URL
- ⚠️ Generate BETTER_AUTH_SECRET → Run `openssl rand -base64 32`
- ⚠️ Create Resend account → Get RESEND_API_KEY
- ⚠️ Add env vars to Vercel
- ⚠️ Deploy to Vercel

**That's it! Everything else is done.**

---

## Troubleshooting

### "DATABASE_URL is not set"
- **Fix**: Add `DATABASE_URL` to Vercel environment variables
- **Check**: Vercel Settings → Environment Variables

### "RESEND_API_KEY is missing"
- **Fix**: Email won't work, but app still runs
- **Solution**: Get API key from resend.com

### "Connection refused" (local)
- **Fix**: Check DATABASE_URL in .env.local
- **Verify**: Can you connect to Neon from your computer?

### "Auth not working"
- **Fix**: Make sure `BETTER_AUTH_SECRET` is set
- **Check**: Restart dev server: `pnpm dev`

### "Email not sending"
- **Fix**: Check `RESEND_API_KEY` is correct
- **Verify**: Check Resend dashboard for errors
- **Tip**: Use test email first

---

## Production Deployment Checklist

- [ ] Database: Neon production instance (not development)
- [ ] Auth secret: Strong 32-byte secret generated
- [ ] Email: Resend live API key (not test)
- [ ] Domain: BETTER_AUTH_URL set to production domain
- [ ] Environment: NODE_ENV = production (auto on Vercel)
- [ ] Backups: Neon automated backups enabled
- [ ] Monitoring: Add Sentry or similar (optional)

---

## Security Notes

1. **Never commit .env.local to git** - Add to .gitignore (already done)
2. **Keep BETTER_AUTH_SECRET secret** - Don't share it
3. **Use production database** - Don't use dev database in production
4. **Rotate secrets regularly** - Every 90 days recommended
5. **Enable 2FA on Neon and Resend** - For account security

---

## Environment Variables Reference

| Variable | Required | Type | Format | Example |
|----------|----------|------|--------|---------|
| DATABASE_URL | Yes | String | PostgreSQL connection | `postgresql://user:pass@host/db` |
| BETTER_AUTH_SECRET | Yes | String | Random 32 bytes | `aBcDeFgHiJ...` |
| RESEND_API_KEY | Yes | String | Resend API key | `re_abc123def...` |
| BETTER_AUTH_URL | Yes | String | Full URL | `https://app.vercel.app` |
| AI_GATEWAY_API_KEY | No | String | API key | `Not needed - uses AI Gateway` |
| NODE_ENV | Auto | String | development/production | Auto-set by Vercel |

---

## Quick Start Command

```bash
# 1. Create .env.local
touch .env.local

# 2. Add your variables (update with real values)
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://user:pass@neon.host/db
BETTER_AUTH_SECRET=your_32_byte_secret
RESEND_API_KEY=re_your_api_key
BETTER_AUTH_URL=http://localhost:3000
EOF

# 3. Install and run
pnpm install
pnpm db:push
pnpm dev

# 4. Open http://localhost:3000
```

---

**All code is production-ready. Only environment variables are needed to run the application.**
