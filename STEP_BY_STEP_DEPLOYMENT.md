# CareerPilot AI - Step-by-Step Deployment Guide

Complete this guide in order. Each step is clearly marked.

---

## PHASE 1: DATABASE SETUP (10 minutes)

### Step 1.1: Open Supabase Dashboard
**Time: 1 minute**

1. Open: https://app.supabase.com/project/njoghcklnnskzlxklfrx
2. Login with your credentials
3. You should see the database dashboard

✅ **Checkpoint:** You see the Supabase dashboard

---

### Step 1.2: Create Database Tables
**Time: 5 minutes**

1. In Supabase, click on **SQL Editor** (left sidebar)
2. Click **New Query** (top right button)
3. Open this file in your project: `migrations/001_create_tables.sql`
4. Copy the entire SQL content
5. Paste into the Supabase SQL Editor query box
6. Click the **Run** button (bottom right or Ctrl+Enter)
7. Wait for completion (you'll see "Success" message)

**What happens:**
- Creates 15 database tables
- Sets up all relationships between tables
- Creates indexes for performance

✅ **Checkpoint:** You see "Success" message in Supabase

---

### Step 1.3: Enable Security Policies
**Time: 3 minutes**

1. In Supabase SQL Editor, click **New Query** again
2. Open this file: `migrations/002_setup_rls_policies.sql`
3. Copy the entire SQL content
4. Paste into the query box
5. Click **Run**
6. Wait for completion

**What happens:**
- Enables Row Level Security (RLS) on all tables
- Users can only see their own data
- Protects against unauthorized access

✅ **Checkpoint:** You see "Success" message again

---

### Step 1.4: Create Storage Buckets
**Time: 2 minutes**

1. In Supabase, click **Storage** (left sidebar)
2. Click **Create a new bucket** (blue button)

**Create Bucket #1: Resumes**
- Bucket name: `resumes`
- Make it **Public** (toggle on)
- Click **Create bucket**

**Create Bucket #2: Portfolio Images**
- Bucket name: `portfolio-images`
- Make it **Public** (toggle on)
- Click **Create bucket**

**Create Bucket #3: Profile Pictures**
- Bucket name: `profile-pictures`
- Make it **Public** (toggle on)
- Click **Create bucket**

**Result:** You should see 3 buckets in the Storage list

✅ **Checkpoint:** All 3 buckets created and visible

---

## PHASE 2: LOCAL TESTING (5 minutes)

### Step 2.1: Install Dependencies
**Time: 2 minutes**

1. Open your terminal/command prompt
2. Navigate to your project folder:
   ```
   cd /path/to/careerpilot-project
   ```
3. Install all dependencies:
   ```
   pnpm install
   ```
4. Wait for installation to complete (you'll see a checkmark at the end)

✅ **Checkpoint:** Installation complete with no errors

---

### Step 2.2: Start Development Server
**Time: 1 minute**

1. In the same terminal, run:
   ```
   pnpm dev
   ```
2. Wait for the server to start
3. You'll see: `▲ Next.js X.XX.X ... ready on http://localhost:3000`

✅ **Checkpoint:** Development server running

---

### Step 2.3: Test the App in Browser
**Time: 2 minutes**

1. Open your browser
2. Go to: http://localhost:3000
3. You should see the CareerPilot AI landing page

**Test Signup:**
1. Click **"Sign Up"** button
2. Enter a test email (e.g., test@example.com)
3. Enter a password
4. Click **"Sign Up"**

**Expected Result:**
- You get signed in
- Dashboard loads
- Welcome email sent to your inbox

✅ **Checkpoint:** Signed up successfully and dashboard loads

---

### Step 2.4: Verify Email Sent
**Time: 1 minute**

1. Check your email inbox (the one you used to sign up)
2. Look for "Welcome to CareerPilot AI" email from noreply@brevo.com
3. Click the link in the email to verify

**If email doesn't arrive:**
- Check spam/junk folder
- Wait 1-2 minutes (sometimes slow)
- Check Brevo account to ensure API key is correct

✅ **Checkpoint:** Welcome email received and verified

---

## PHASE 3: DEPLOYMENT (3 minutes)

### Step 3.1: Stop Local Server
**Time: 1 minute**

1. In your terminal where `pnpm dev` is running
2. Press **Ctrl+C** to stop the server
3. Terminal control returns to normal (you see the prompt)

✅ **Checkpoint:** Development server stopped

---

### Step 3.2: Push Code to GitHub
**Time: 2 minutes**

1. In terminal, run these commands one by one:

```bash
git add .
```

```bash
git commit -m "Deploy CareerPilot AI - All production fixes applied"
```

```bash
git push origin main
```

**Wait for push to complete** (you'll see confirmation)

✅ **Checkpoint:** Code pushed to GitHub

---

### Step 3.3: Vercel Auto-Deployment
**Time: 2-3 minutes (automatic)**

1. Visit: https://vercel.com/dashboard
2. You should see your CareerPilot project
3. Click on it
4. You'll see a deployment in progress (building...)
5. Wait for it to complete (turns green with ✓)

**What's happening:**
- Vercel detects your push
- Downloads code from GitHub
- Installs dependencies
- Builds the project
- Deploys to production servers
- Assigns a live URL

✅ **Checkpoint:** Deployment shows green checkmark (✓ Completed)

---

### Step 3.4: Test Production App
**Time: 2 minutes**

1. In Vercel dashboard, click the **Visit** button (or copy the URL)
2. Your production URL: https://v0-careerpilot.vercel.app
3. Test the same signup process:
   - Sign up with different email
   - Check email inbox
   - Verify it works

✅ **Checkpoint:** Production app is live and working

---

## FINAL CHECKLIST

Before you're done, verify everything:

- [ ] Supabase: 15 tables created (Step 1.2)
- [ ] Supabase: RLS policies enabled (Step 1.3)
- [ ] Supabase: 3 storage buckets created (Step 1.4)
- [ ] Local: `pnpm dev` runs without errors (Step 2.2)
- [ ] Local: Can sign up and see dashboard (Step 2.3)
- [ ] Local: Welcome email received (Step 2.4)
- [ ] GitHub: Code pushed to main branch (Step 3.2)
- [ ] Vercel: Deployment completed successfully (Step 3.3)
- [ ] Production: App is live at your URL (Step 3.4)

✅ **ALL DONE!** Your CareerPilot AI is now LIVE! 🚀

---

## TROUBLESHOOTING

### "Database error" or "RLS policy error"
- Verify you ran BOTH migration files (001 and 002)
- Check Supabase shows the tables exist

### "Email not sending"
- Check BREVO_API_KEY is set correctly in environment
- Check spam folder for emails
- Wait 1-2 minutes

### Build fails on Vercel
- Check Vercel deployment logs
- Verify all environment variables are set in Vercel Settings
- Run `pnpm build` locally to check for errors

### Can't see 3 buckets in storage
- Refresh the Supabase page
- Make sure each bucket is set to "Public"
- Try creating them again

### App doesn't load after deployment
- Wait 1-2 minutes for DNS to propagate
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing

---

## SUCCESS INDICATORS

You know you're successful when:

✓ Supabase shows 15 tables  
✓ Supabase shows 3 storage buckets  
✓ Local development works: `pnpm dev`  
✓ Can sign up and see dashboard  
✓ Welcome email arrives in inbox  
✓ Code pushed to GitHub  
✓ Vercel shows green checkmark  
✓ Production app loads at your URL  
✓ Can sign up in production  
✓ No errors in Vercel logs  

**When you check all these boxes, you're LIVE!** 🎉

---

## NEXT STEPS AFTER DEPLOYMENT

After you're live, you can:

1. **Monitor:** Check Vercel logs for any errors
2. **Invite Users:** Share your app URL with people to test
3. **Enhance:** Add GitHub OAuth profile import
4. **Improve:** Add LinkedIn OAuth profile import
5. **Scale:** Monitor performance and optimize

---

## SUPPORT

If you get stuck:

1. Check the **TROUBLESHOOTING** section above
2. Read **READY_TO_DEPLOY.md** for more details
3. Check Supabase and Vercel dashboards for error messages

Good luck! You've got this! 🚀
