# CareerPilot AI - Supabase Only Setup Guide

**Status:** Ready for production (Supabase as single database)

---

## What You Need (5 External Services)

### 1. **Supabase** (PostgreSQL Database) - REQUIRED
- **URL:** https://supabase.com
- **What to get:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Why:** All user data, authentication, and RLS policies

### 2. **OpenAI API** - REQUIRED
- **URL:** https://platform.openai.com/api-keys
- **What to get:** `OPENAI_API_KEY`
- **Why:** Resume analysis, career coaching, AI features

### 3. **Brevo Email** - REQUIRED
- **URL:** https://brevo.com
- **What to get:** `BREVO_API_KEY`, `EMAIL_FROM`
- **Why:** Send emails (resume analysis, job matches, digest)

### 4. **Vercel** - REQUIRED
- **URL:** https://vercel.com
- **What to do:** Deploy the app, add environment variables
- **Why:** Hosting and deployment

### 5. **GitHub OAuth** (Optional)
- **URL:** https://github.com/settings/developers
- **What to get:** `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`
- **Why:** GitHub profile analysis

---

## Environment Variables (14 Total)

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication (REQUIRED)
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=https://your-domain.vercel.app

# Email (REQUIRED)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@your-domain.com

# AI (REQUIRED)
OPENAI_API_KEY=sk-...

# Scheduled Jobs (REQUIRED)
CRON_SECRET=<generate with: openssl rand -base64 32>

# Public URL (REQUIRED)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# GitHub OAuth (OPTIONAL)
GITHUB_OAUTH_CLIENT_ID=your_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_client_secret

# Admin Emails (OPTIONAL)
ADMIN_EMAILS=admin@yourdomain.com
```

---

## Quick Setup Steps (In Order)

### Step 1: Generate Secrets
```bash
openssl rand -base64 32  # BETTER_AUTH_SECRET
openssl rand -base64 32  # CRON_SECRET
```

### Step 2: Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose region closest to users
4. Go to Settings → API
5. Copy and save all three keys

### Step 3: Create OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key

### Step 4: Create Brevo Account
1. Go to https://brevo.com
2. Sign up (free)
3. Go to SMTP & API
4. Copy API Key

### Step 5: Deploy to Vercel
1. Go to https://vercel.com
2. Import GitHub repository
3. Add all 14 environment variables
4. Click Deploy

### Step 6: Verify Deployment
```bash
# After deployment starts:
vercel env pull .env.local
pnpm db:push  # Run Supabase migrations
```

---

## What This Gives You

✅ **Database:** All user data, secure, with RLS policies
✅ **Auth:** Email/password login with Better Auth
✅ **Emails:** Weekly digests, resume analysis, job matches
✅ **AI:** Resume analysis, career coaching, cover letters
✅ **Scheduling:** Cron jobs for emails and reminders
✅ **Profiles:** GitHub/LinkedIn profile analysis (optional)
✅ **Hosting:** Vercel serverless deployment

---

## Database Tables (Auto-Created)

- users
- accounts
- sessions
- verificationTokens
- resumes
- jobMatches
- userPreferences
- aiCoachSessions
- emailLogs
- notifications
- And 5+ more...

---

## That's It!

No code changes needed. Just:
1. Create accounts on 4-5 services
2. Copy API keys
3. Add to Vercel
4. Deploy

Your app is production-ready. 🚀
