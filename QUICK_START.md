# Quick Start - 3 Steps to Get Running

## Step 1️⃣: Copy Connection String from Supabase (2 minutes)

**In your browser, open:**
```
https://app.supabase.com/project/chogupjjindroxqkdxjg
```

**Then follow this path:**
```
Settings (⚙️ gear icon on left) 
  → Database (tab at top)
  → Scroll down to "Connection string"
  → Click "URI" tab
  → Copy the string
```

**The string looks like:**
```
postgresql://postgres.chogupjjindroxqkdxjg:YOUR_PASSWORD@aws-0-us-east-1.db.supabase.co:5432/postgres
```

**Important:** If it shows `[PASSWORD]`, replace `[PASSWORD]` with your actual database password

**SAVE THIS STRING - you'll need it next**

---

## Step 2️⃣: Run Database Setup (1 minute)

**In Supabase, go to:**
```
SQL Editor (left sidebar)
  → New Query
  → Copy this entire file: migrations/001_create_tables.sql
  → Paste into editor
  → Click Run
  → Wait for success
```

**This creates all your database tables.**

---

## Step 3️⃣: Get API Keys (2 minutes)

**For RESEND_API_KEY:**
```
Go to: https://resend.com/api-keys
Sign in → Copy your key (starts with "re_")
```

**For Supabase keys (if not already set):**
```
In Supabase:
Settings → API
Copy:
  - Project URL → NEXT_PUBLIC_SUPABASE_URL
  - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY  
  - Service Role Key → SUPABASE_SERVICE_ROLE_KEY
```

---

## Step 4️⃣: Add Environment Variables (3 minutes)

**Go to your Vercel project settings:**
```
Settings → Environment Variables
```

**Add these:**
```
DATABASE_URL = postgresql://postgres.chogupjjindroxqkdxjg:PASSWORD@aws-0-us-east-1.db.supabase.co:5432/postgres
RESEND_API_KEY = re_your_key_here
NEXT_PUBLIC_SUPABASE_URL = https://chogupjjindroxqkdxjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
```

---

## Step 5️⃣: Test It (2 minutes)

**Restart your dev server and test:**

1. Go to `/login`
2. Click "Sign Up"
3. Enter email and password
4. Click "Sign Up"
5. ✅ You should see the dashboard (no 404!)
6. Try clicking a feature like "Analyze Resume"
7. Try logout from sidebar menu

**Done!** 🎉

---

## Issues?

| Problem | Solution |
|---------|----------|
| 404 after login | Restart dev server, check env vars |
| Can't find connection string | Make sure you're in Settings → Database, not somewhere else |
| Database error | Re-run the SQL migration in SQL Editor |
| Email not working | Check RESEND_API_KEY is set correctly |
| "Unauthorized" error | Make sure you're logged in before accessing features |

---

## Need the full details?

See: `SUPABASE_SETUP.md` or `SETUP_CHECKLIST.md`
