# CareerPilot AI - Supabase Complete Setup Guide

## Step 1: Get Your Database URL from Supabase

**You MUST do this manually in your Supabase dashboard:**

1. Go to https://app.supabase.com/project/chogupjjindroxqkdxjg
2. Click **Settings** (gear icon) in left sidebar
3. Click **Database** tab
4. Scroll down to find **"Connection string"** section
5. Click the **"URI"** tab
6. Copy the entire connection string that looks like:
   ```
   postgresql://postgres.PROJECT_ID:PASSWORD@aws-0-region.db.supabase.co:5432/postgres
   ```
   - If it shows `[PASSWORD]`, replace it with your actual database password
7. **Copy this entire string** - you'll need it next

## Step 2: Create Database Tables

**Now copy the SQL and run it in Supabase:**

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query** or **New SQL Query**
3. Open the file: `migrations/001_create_tables.sql` in your project
4. Copy the ENTIRE contents of that SQL file
5. Paste it into the Supabase SQL Editor
6. Click **Run** button (or press Ctrl+Enter)
7. Wait for it to complete successfully (you'll see a success message)

**What this does:**
- Creates all 12 database tables
- Sets up Row Level Security (RLS) so users can only see their own data
- Creates indexes for performance

## Step 3: Set Environment Variables

You need these environment variables set in your Vercel project:

1. **NEXT_PUBLIC_SUPABASE_URL** ✅ (Already set)
   - Your Supabase project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** ✅ (Already set)
   - Your Supabase public Anon key

3. **SUPABASE_SERVICE_ROLE_KEY** ✅ (Already set)
   - Your Supabase Service Role key (for server-side operations)

4. **DATABASE_URL** ❌ (Need to set)
   - The PostgreSQL connection string you copied in Step 1
   - Add this in your Vercel project settings under "Environment Variables"

5. **RESEND_API_KEY** ❌ (Need to set)
   - Get this from https://resend.com/api-keys
   - Add this in your Vercel project settings under "Environment Variables"

## Step 4: Enable Email Notifications (Optional)

The app uses Resend to send email notifications for resume analysis:

1. Go to https://resend.com
2. Sign up or log in
3. Go to **API Keys** section
4. Copy your API key (starts with `re_`)
5. Add it to your environment variables as `RESEND_API_KEY`

## Step 5: Test the Setup

Once all environment variables are set:

1. Go to your app preview
2. Try to **Register** a new account
3. Fill in email and password, click "Sign Up"
4. You should be redirected to the dashboard
5. Try clicking a profile analysis to test database operations
6. Check your email for notifications (if Resend is set up)

## Troubleshooting

### Connection String Issues
- Make sure you copied the ENTIRE string including `postgresql://` at the start
- Replace `[PASSWORD]` with your actual database password
- The password is what you set when creating your Supabase project

### RLS Policy Errors
- If you see "permission denied" errors, it means RLS is working but the user isn't authenticated
- Make sure you're logged in before accessing features

### Database Errors
- If tables don't exist, re-run the SQL migration in the SQL Editor
- Check that all SQL ran without errors (look for red error messages)

### Email Not Sending
- Make sure `RESEND_API_KEY` is set correctly
- Check that the key starts with `re_`
- Verify it's set in your Vercel environment variables

## Database Tables

These tables are automatically created:

1. **user_profiles** - User account info
2. **linkedin_profiles** - LinkedIn data
3. **linkedin_analysis** - LinkedIn analysis results
4. **github_profiles** - GitHub data
5. **github_analysis** - GitHub analysis results
6. **portfolio_projects** - User's portfolio projects
7. **portfolio_analysis** - Portfolio analysis results
8. **resumes** - Uploaded resumes
9. **resume_analysis** - Resume analysis results
10. **notifications** - User notifications
11. **user_analytics** - User activity tracking
12. **user_settings** - User preferences

All tables have **Row Level Security (RLS)** enabled, so users can only access their own data.

## Security

- ✅ Row Level Security (RLS) - Users can only access their own data
- ✅ Supabase Auth - Managed authentication
- ✅ Service Role Key - Used only on the server for privileged operations
- ✅ Parameterized queries - Protection against SQL injection (via Drizzle ORM)

## Next Steps

1. ✅ Get DATABASE_URL from Supabase
2. ✅ Run the SQL migration
3. ✅ Set environment variables (DATABASE_URL and RESEND_API_KEY)
4. ✅ Test the app
5. ✅ Deploy to production

---

**Need help?** Check the code in:
- `/lib/supabase/server.ts` - Server-side Supabase client
- `/lib/auth-client.ts` - Client-side auth functions
- `/providers/auth-provider.tsx` - Auth context provider
