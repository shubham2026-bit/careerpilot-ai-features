## Manual Supabase Setup - Step by Step

### Step 1: Create Database Tables

1. Go to your Supabase Project: https://app.supabase.com/project/chogupjjindroxqkdxjg
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire SQL script below
5. Paste it into the SQL editor
6. Click **Run** button

**SQL Script to run:**
```sql
-- Copy the entire content from: /vercel/share/v0-project/migrations/001_create_tables.sql
```

Just copy the entire migration file content and paste it into Supabase SQL Editor, then click Run.

### Step 2: Add Environment Variables

Add these to your Vercel project:

**Environment Variables to add:**
```
DATABASE_URL=postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres
RESEND_API_KEY=re_jEeaMzNs_NvEY94VeoZ6ZxYsxrWErQDry
NEXT_PUBLIC_SUPABASE_URL=https://chogupjjindroxqkdxjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Anon Key from earlier]
SUPABASE_SERVICE_ROLE_KEY=[Your Service Role Key from earlier]
```

### Step 3: Test the App

1. Go to http://localhost:3000 (or your dev preview)
2. Click **Sign Up**
3. Create an account with your email
4. You should be redirected to the dashboard
5. Try logging out and logging back in

### That's it!

Your app is now fully configured with Supabase and should work perfectly!
