# Complete Supabase Setup for CareerPilot AI

## Quick Overview
This guide walks through setting up Supabase for CareerPilot AI in 15 minutes.

## Prerequisites
- Supabase account (free tier works)
- Project URL: `https://njoghcklnnskzlxklfrx.supabase.co`
- Your anon key and service role key

## Step 1: Create Tables (5 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `njoghcklnnskzlxklfrx`
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy entire contents of `/migrations/001_create_tables.sql`
6. Paste into SQL Editor
7. Click **Run**
8. ✅ All tables created with indexes

## Step 2: Enable Row Level Security (RLS) (3 minutes)

1. In SQL Editor, click **New Query**
2. Copy entire contents of `/migrations/002_setup_rls_policies.sql`
3. Paste and click **Run**
4. ✅ All security policies enabled

## Step 3: Create Storage Buckets (3 minutes)

Follow the instructions in `SUPABASE_STORAGE_SETUP.md`:
- Create 3 buckets: `resumes`, `portfolio-images`, `profile-pictures`
- Configure policies for each
- ✅ Storage ready

## Step 4: Verify Setup (2 minutes)

### Check Tables Exist
1. Click **Table Editor** in sidebar
2. You should see all these tables:
   - user_profiles
   - resumes
   - resume_analysis
   - skills
   - education
   - experience
   - jobs
   - job_matches
   - saved_jobs
   - email_notifications
   - user_analytics
   - career_tips
   - user_career_tips
   - certifications

### Check Storage Buckets
1. Click **Storage** in sidebar
2. You should see 3 buckets:
   - resumes
   - portfolio-images
   - profile-pictures

### Test Connection
Run in browser console:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://njoghcklnnskzlxklfrx.supabase.co',
  'YOUR_ANON_KEY'
)

// Test connection
const { data, error } = await supabase.from('user_profiles').select('*').limit(1)
console.log(data, error)
```

## Step 5: Configure Environment Variables

Your `.env.development.local` should have:
```
NEXT_PUBLIC_SUPABASE_URL=https://njoghcklnnskzlxklfrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

## Next Steps

1. **Test Authentication**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Create test account
   - Verify user appears in `user_profiles` table

2. **Test Resume Upload**
   - Upload a resume in dashboard
   - Check `resumes` bucket in Storage
   - Verify file appears in `resumes` table

3. **Test Email Service**
   - Complete a profile action
   - Check Brevo dashboard for emails
   - Verify `email_notifications` table has records

## Troubleshooting

### Tables Not Appearing
- Check SQL execution had no errors
- Refresh SQL Editor
- Check for migration messages in console

### RLS Policies Not Working
- Verify all policies created successfully
- Check "Enable RLS" toggle for each table
- Test with different auth states

### Storage Upload Fails
- Check bucket policies are correct
- Verify auth token is valid
- Check file size < 100MB
- Enable CORS if cross-origin

### Connection Errors
- Verify URL and keys are correct
- Check internet connection
- Verify Supabase project is active

## Important Security Notes

1. **Never commit keys to GitHub**
   - Keys are in `.env.development.local`
   - This file is in `.gitignore`

2. **Service Role Key is Sensitive**
   - Only use on server-side
   - Never expose to client
   - Used for cron jobs and admin operations

3. **RLS is Critical**
   - Always enable for production
   - Policies prevent unauthorized data access
   - Test before deploying

## Database Schema Overview

```
user_profiles (auth users extended)
├── resumes (user's resume files)
│   └── resume_analysis (analysis scores)
├── skills (user's technical skills)
├── education (degrees, certifications)
├── experience (job history)
├── job_matches (recommended jobs)
├── saved_jobs (bookmarked jobs)
├── email_notifications (email logs)
├── user_analytics (activity tracking)
└── certifications (professional certs)

jobs (job database - public)
└── job_matches (link to users)

career_tips (public tips)
└── user_career_tips (user progress)
```

## Performance Optimization

All tables have indexes on:
- `user_id` (for fast filtering)
- Foreign keys (for joins)
- Frequently queried fields

This ensures queries run in < 100ms even with millions of rows.

## Next: Deploy to Production

Once verified locally:
1. Add same environment variables to Vercel
2. Deploy: `git push origin main`
3. Vercel auto-deploys
4. Monitor logs for any issues

You're now ready to deploy CareerPilot AI! 🚀
