# CareerPilot AI - Production Readiness Checklist

## Complete Audit of Requirements for Production Deployment

**Last Updated:** 2026-07-21  
**Project:** CareerPilot AI  
**Status:** Awaiting setup - NOT production ready yet

---

## 1. API Keys You Need to Provide

### OpenAI (REQUIRED)
- **Environment Variable:** `OPENAI_API_KEY`
- **Purpose:** AI-powered resume analysis, career coaching, cover letter generation
- **Get it:** https://platform.openai.com/api-keys
- **Required for:**
  - Resume analysis endpoint
  - Career coach chat
  - Interview prep
  - Cover letter generation
  - Skill gap analysis
- **Model Used:** gpt-4o and gpt-4o-mini
- **Status:** ❌ NOT PROVIDED
- **Cost:** Pay-as-you-go (Recommended for production)

### Brevo Email (REQUIRED)
- **Environment Variables:** `BREVO_API_KEY` OR `SENDINBLUE_API_TOKEN`
- **Purpose:** Send emails (resume analysis, job matches, weekly digest)
- **Get it:** https://brevo.com → SMTP & API section
- **Required for:**
  - Weekly digest emails
  - Resume analysis completion emails
  - Job match notifications
  - User preference emails
- **Status:** ❌ NOT PROVIDED
- **Cost:** Free tier available (300 emails/day), paid plans for higher volume

### GitHub OAuth (OPTIONAL - LinkedIn is alternative)
- **Environment Variables:** `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`
- **Purpose:** GitHub profile analysis for developers
- **Get it:** https://github.com/settings/developers → OAuth Apps → Create New
- **Required for:**
  - GitHub developer score analysis
  - Portfolio project analysis
  - Code quality evaluation
- **Callback URL:** `https://your-domain.com/api/auth/github/callback`
- **Scopes Needed:** `user:email read:user`
- **Status:** ❌ NOT PROVIDED
- **Cost:** Free

### LinkedIn OAuth (OPTIONAL - GitHub is alternative)
- **Environment Variables:** `LINKEDIN_OAUTH_CLIENT_ID`, `LINKEDIN_OAUTH_CLIENT_SECRET`
- **Purpose:** LinkedIn profile analysis for professionals
- **Get it:** https://www.linkedin.com/developers/apps → Create app
- **Required for:**
  - LinkedIn profile strength scoring
  - Professional network analysis
  - Employment history analysis
- **Callback URL:** `https://your-domain.com/api/auth/linkedin/callback`
- **Scopes Needed:** `openid profile email`
- **Status:** ❌ NOT PROVIDED
- **Cost:** Free (requires LinkedIn company page)

---

## 2. Environment Variables You Need to Add

### Database Connection
```
DATABASE_URL=postgresql://user:password@host:5432/careerpilot
```
- **Purpose:** PostgreSQL connection string
- **Get from:** Neon console
- **Status:** ❌ NOT PROVIDED
- **Format:** Must be valid PostgreSQL URL

### Authentication
```
BETTER_AUTH_SECRET=<random_32_char_string>
BETTER_AUTH_URL=https://your-domain.vercel.app
```
- **BETTER_AUTH_SECRET:** Generate with `openssl rand -base64 32`
- **BETTER_AUTH_URL:** Your production domain
- **Status:** ❌ NOT PROVIDED (SECRET must be generated)

### Email Configuration
```
BREVO_API_KEY=<your_brevo_api_key>
EMAIL_FROM=noreply@your-domain.com
```
- **BREVO_API_KEY:** From Brevo SMTP & API section
- **EMAIL_FROM:** Your sender email (should match verified domain)
- **Status:** ❌ NOT PROVIDED

### Cron Jobs
```
CRON_SECRET=<random_secret>
```
- **Purpose:** Secure cron job endpoints (weekly digest, resume reminders)
- **Generate:** `openssl rand -base64 32`
- **Status:** ❌ NOT PROVIDED

### AI Provider
```
OPENAI_API_KEY=sk-...
```
- **Purpose:** LLM API access
- **Get from:** https://platform.openai.com/api-keys
- **Status:** ❌ NOT PROVIDED

### OAuth - GitHub (Optional)
```
GITHUB_OAUTH_CLIENT_ID=<your_client_id>
GITHUB_OAUTH_CLIENT_SECRET=<your_client_secret>
```
- **Purpose:** GitHub OAuth integration
- **Status:** ❌ NOT PROVIDED

### OAuth - LinkedIn (Optional)
```
LINKEDIN_OAUTH_CLIENT_ID=<your_client_id>
LINKEDIN_OAUTH_CLIENT_SECRET=<your_client_secret>
```
- **Purpose:** LinkedIn OAuth integration
- **Status:** ❌ NOT PROVIDED

### Public URLs
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```
- **Status:** ❌ NOT PROVIDED

### Server-Only Secrets
```
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```
- **Status:** ❌ NOT PROVIDED

### Admin Configuration (Optional)
```
ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
```
- **Status:** ❌ OPTIONAL

---

## 3. External Accounts You Need to Create

### Neon PostgreSQL Database (REQUIRED)
- **Website:** https://neon.tech
- **What to do:**
  1. Sign up for free account
  2. Create new project
  3. Copy connection string (DATABASE_URL)
  4. Save in Vercel as DATABASE_URL
- **Why:** Primary database for all user and app data
- **Status:** ❌ NOT CREATED

### Vercel Deployment Account (REQUIRED)
- **Website:** https://vercel.com
- **What to do:**
  1. Create account
  2. Connect GitHub repository
  3. Add environment variables
  4. Deploy
- **Why:** Hosting and deployment platform
- **Status:** ❌ NOT CREATED

### Brevo Email Service (REQUIRED)
- **Website:** https://brevo.com
- **What to do:**
  1. Sign up (free tier available)
  2. Go to SMTP & API
  3. Copy API Key
  4. Add to Vercel as BREVO_API_KEY
- **Why:** Email notifications system
- **Status:** ❌ NOT CREATED

### OpenAI API Account (REQUIRED)
- **Website:** https://platform.openai.com
- **What to do:**
  1. Sign up
  2. Add payment method
  3. Go to API Keys
  4. Create new secret key
  5. Add to Vercel as OPENAI_API_KEY
- **Why:** AI features (analysis, coaching, generation)
- **Status:** ❌ NOT CREATED

### GitHub OAuth App (OPTIONAL)
- **Website:** https://github.com/settings/developers
- **What to do:**
  1. Click "OAuth Apps" → "New OAuth App"
  2. Fill in app details
  3. Set callback URL: `https://your-domain.com/api/auth/github/callback`
  4. Save Client ID and Secret
- **Why:** GitHub profile analysis
- **Status:** ❌ NOT CREATED

### LinkedIn OAuth App (OPTIONAL)
- **Website:** https://www.linkedin.com/developers/apps
- **What to do:**
  1. Create new app
  2. Set callback URL: `https://your-domain.com/api/auth/linkedin/callback`
  3. Save Client ID and Secret
  4. Request profile access scopes
- **Why:** LinkedIn profile analysis
- **Status:** ❌ NOT CREATED

---

## 4. Manual Dashboard Configuration

### Neon PostgreSQL Setup
- [ ] Create account at neon.tech
- [ ] Create new project
- [ ] Wait for database initialization (2-3 minutes)
- [ ] Copy connection string
- [ ] Note: Database name and credentials

**In Vercel Dashboard:**
- [ ] Add `DATABASE_URL` environment variable

**Then in terminal (after Vercel deployment):**
```bash
vercel env pull .env.local
pnpm db:push
```

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Connect GitHub repository to Vercel
- [ ] Go to project Settings → Environment Variables
- [ ] Add all 17 required environment variables:

| Variable | Type | Status |
|----------|------|--------|
| DATABASE_URL | Secret | ❌ |
| BETTER_AUTH_SECRET | Secret | ❌ |
| BETTER_AUTH_URL | Standard | ❌ |
| OPENAI_API_KEY | Secret | ❌ |
| BREVO_API_KEY | Secret | ❌ |
| EMAIL_FROM | Standard | ❌ |
| CRON_SECRET | Secret | ❌ |
| GITHUB_OAUTH_CLIENT_ID | Standard | ❌ |
| GITHUB_OAUTH_CLIENT_SECRET | Secret | ❌ |
| LINKEDIN_OAUTH_CLIENT_ID | Standard | ❌ |
| LINKEDIN_OAUTH_CLIENT_SECRET | Secret | ❌ |
| NEXT_PUBLIC_APP_URL | Standard | ❌ |
| NEXT_PUBLIC_SUPABASE_URL | Standard | ❌ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Standard | ❌ |
| SUPABASE_SERVICE_ROLE_KEY | Secret | ❌ |
| ADMIN_EMAILS | Standard | ❌ (OPTIONAL) |

- [ ] Deploy: Click Deploy button or `git push`

### Brevo Email Setup
- [ ] Sign up at brevo.com
- [ ] Go to SMTP & API section
- [ ] Copy API Key
- [ ] Go to Senders section
- [ ] Add your domain (e.g., noreply@yourdomain.com)
- [ ] Verify domain ownership (DNS records)
- [ ] Test email delivery

### OpenAI API Setup
- [ ] Create account at platform.openai.com
- [ ] Add payment method
- [ ] Go to API Keys
- [ ] Create new secret key
- [ ] Copy and save securely
- [ ] Set usage limits (recommended)

### GitHub OAuth Setup (If using GitHub)
- [ ] Go to github.com/settings/developers
- [ ] Click "OAuth Apps" → "New OAuth App"
- [ ] Fill in:
  - **Application name:** CareerPilot AI
  - **Homepage URL:** https://your-domain.com
  - **Authorization callback URL:** https://your-domain.com/api/auth/github/callback
- [ ] Copy Client ID and Client Secret
- [ ] Add to Vercel environment variables

### LinkedIn OAuth Setup (If using LinkedIn)
- [ ] Go to linkedin.com/developers/apps
- [ ] Create new app
- [ ] Set callback URL: https://your-domain.com/api/auth/linkedin/callback
- [ ] Request scopes: openid, profile, email
- [ ] Copy Client ID and Client Secret
- [ ] Add to Vercel environment variables

### Vercel Cron Job Configuration
- [ ] Go to Vercel Project Settings
- [ ] Go to Cron Jobs
- [ ] Add two jobs:

**Job 1: Weekly Digest**
- Path: `/api/cron/weekly-digest`
- Schedule: `0 10 * * 1` (Monday 10 AM UTC)
- Must provide: `CRON_SECRET` header

**Job 2: Resume Reminders**
- Path: `/api/cron/resume-reminders`
- Schedule: `0 9 * * *` (Daily 9 AM UTC)
- Must provide: `CRON_SECRET` header

---

## 5. DNS/Domain Requirements

### Custom Domain (REQUIRED for Production)
- [ ] Purchase domain (e.g., careerpilot.ai)
- [ ] Add to Vercel: Project Settings → Domains
- [ ] Update nameservers or add CNAME record
- [ ] Wait for DNS propagation (5-30 min)

### Email Domain Verification (For Brevo)
- [ ] In Brevo dashboard, go to Senders
- [ ] Add your domain (e.g., noreply@careerpilot.ai)
- [ ] Brevo will provide DNS records
- [ ] Add to your domain DNS:
  - SPF record
  - DKIM record
  - MX record (if needed)
- [ ] Verify in Brevo dashboard
- [ ] Wait for verification (5-30 min)

### SSL/TLS Certificate
- [ ] Vercel automatically provides (LetsEncrypt)
- [ ] No manual action needed

---

## 6. Optional Integrations

### GitHub Profile Analysis
- **Status:** Optional (LinkedIn can substitute)
- **Setup:** Create GitHub OAuth app (see section 3)
- **Users can:** Connect GitHub to analyze code and projects
- **Cost:** Free

### LinkedIn Profile Analysis
- **Status:** Optional (GitHub can substitute)
- **Setup:** Create LinkedIn OAuth app (see section 3)
- **Users can:** Connect LinkedIn to analyze professional profile
- **Cost:** Free

### Alternative AI Providers
- **Anthropic Claude:** Not currently configured
- **Google Gemini:** Not currently configured
- **Groq:** Not currently configured
- **Note:** Currently hardcoded to OpenAI via AI SDK

### Analytics & Monitoring
- **Not Configured:** Sentry, DataDog, PostHog, Segment
- **Recommendation:** Add after launch for production monitoring

### File Storage
- **Status:** Currently NOT implemented
- **Note:** File uploads are processed but not persisted
- **Recommended:** Implement Vercel Blob or AWS S3 later

---

## 7. Final Production Checklist

### Before Deployment

#### Code & Build
- [ ] Build compiles successfully: `pnpm build`
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] All tests pass: `pnpm test` (if applicable)
- [ ] README updated with setup instructions
- [ ] No console.log statements in production code

#### Security
- [ ] BETTER_AUTH_SECRET is strong (openssl generated)
- [ ] CRON_SECRET is random and strong
- [ ] All API keys are marked as "Secret" in Vercel
- [ ] No API keys in code or .env.local
- [ ] Database connection requires authentication
- [ ] CORS is properly configured
- [ ] Rate limiting is configured

#### Database
- [ ] Neon database created
- [ ] DATABASE_URL added to Vercel
- [ ] Migrations run: `pnpm db:push`
- [ ] Database schema verified
- [ ] RLS policies enabled (Supabase)

#### Email
- [ ] Brevo account created
- [ ] BREVO_API_KEY added to Vercel
- [ ] EMAIL_FROM domain verified
- [ ] SPF/DKIM records added to DNS
- [ ] Test email sent and received

#### AI Provider
- [ ] OpenAI account created
- [ ] Payment method added
- [ ] OPENAI_API_KEY created and added to Vercel
- [ ] API key has appropriate rate limits
- [ ] Models are available (gpt-4o, gpt-4o-mini)

#### OAuth (if using)
- [ ] GitHub app created (if using)
- [ ] Callback URL set correctly
- [ ] Client ID and Secret in Vercel
- [ ] LinkedIn app created (if using)
- [ ] Callback URL set correctly
- [ ] Client ID and Secret in Vercel

#### Domain & DNS
- [ ] Custom domain registered
- [ ] Domain added to Vercel
- [ ] DNS records updated (nameservers or CNAME)
- [ ] DNS propagation complete (test with `nslookup`)
- [ ] HTTPS working
- [ ] Email domain verified in Brevo

#### Monitoring & Logging
- [ ] Error logging configured
- [ ] Console errors monitored
- [ ] Cron job execution monitored
- [ ] Email delivery monitored in Brevo

### After Deployment

#### Smoke Testing
- [ ] Website loads at your domain
- [ ] Auth pages work (login, register)
- [ ] Email verification works
- [ ] Dashboard loads
- [ ] Resume upload works
- [ ] AI features respond
- [ ] Email sent after resumeanalysis
- [ ] Weekly cron job can be triggered

#### User Testing
- [ ] Create test account
- [ ] Upload test resume
- [ ] Receive analysis email
- [ ] Check job search
- [ ] Test career coach chat
- [ ] Test GitHub/LinkedIn integration (if enabled)

#### Performance
- [ ] Page load time < 3s
- [ ] API responses < 500ms
- [ ] No 404 errors
- [ ] No 5xx errors
- [ ] Images load quickly

#### Monitoring
- [ ] Set up error alerts
- [ ] Monitor database usage
- [ ] Monitor email delivery rate
- [ ] Monitor API rate limits
- [ ] Set up uptime monitoring

### Go-Live Decisions

- [ ] All environment variables set
- [ ] All external services configured
- [ ] Database initialized
- [ ] SSL certificate active
- [ ] Domain pointing to Vercel
- [ ] Email delivery verified
- [ ] Cron jobs scheduled
- [ ] Monitoring active
- [ ] Backup strategy documented
- [ ] Support/feedback channel ready

---

## Summary of Missing Items

### CRITICAL (Cannot launch without these)
1. ❌ OpenAI API key and account
2. ❌ Neon PostgreSQL database
3. ❌ Brevo email account
4. ❌ BETTER_AUTH_SECRET (needs to be generated)
5. ❌ CRON_SECRET (needs to be generated)
6. ❌ Vercel account and environment variables

### IMPORTANT (Should have before launch)
7. ❌ GitHub OAuth (for GitHub integration)
8. ❌ LinkedIn OAuth (for LinkedIn integration)
9. ❌ Custom domain
10. ❌ Email domain verification

### NICE TO HAVE (Can add after launch)
11. ⭕ Error monitoring (Sentry)
12. ⭕ Analytics tracking
13. ⭕ File storage (Blob)
14. ⭕ Performance monitoring

---

## Quick Setup Checklist (Copy-Paste)

```bash
# 1. Generate secrets
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
CRON_SECRET=$(openssl rand -base64 32)

# 2. Get these from services:
# - OpenAI API key from https://platform.openai.com/api-keys
# - Brevo API key from https://brevo.com/smtp-api
# - Neon connection string from https://console.neon.tech

# 3. In Vercel, add environment variables:
# DATABASE_URL
# BETTER_AUTH_SECRET
# BETTER_AUTH_URL
# OPENAI_API_KEY
# BREVO_API_KEY
# EMAIL_FROM
# CRON_SECRET
# NEXT_PUBLIC_APP_URL
# NEXT_PUBLIC_SUPABASE_URL (if using Supabase)
# NEXT_PUBLIC_SUPABASE_ANON_KEY (if using Supabase)
# SUPABASE_SERVICE_ROLE_KEY (if using Supabase)

# 4. Deploy via Vercel
git push origin main

# 5. Run migrations (after deployment starts)
vercel env pull .env.local
pnpm db:push
```

---

## Contact & Support

- **Database Issues:** https://neon.tech/docs
- **Deployment Issues:** https://vercel.com/docs
- **Email Issues:** https://developers.brevo.com/docs
- **AI API Issues:** https://platform.openai.com/docs
- **Auth Issues:** https://betterauth.dev
