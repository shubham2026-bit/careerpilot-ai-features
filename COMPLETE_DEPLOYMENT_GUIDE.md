# COMPLETE CAREERPILOT AI DEPLOYMENT GUIDE
# WITH ALL EXACT CODE & COMMANDS

## TABLE OF CONTENTS
1. Phase 1: Database Setup (10 min)
2. Phase 2: Local Testing (5 min)
3. Phase 3: Production Deployment (3 min)
4. Complete Verification Checklist
5. Troubleshooting

---

# PHASE 1: DATABASE SETUP (10 MINUTES)
## YOU DO THIS IN SUPABASE DASHBOARD

### STEP 1: Login to Supabase
```
URL: https://app.supabase.com/project/njoghcklnnskzlxklfrx
Username: Your Supabase Email
Password: Your Supabase Password
```

### STEP 2: Create All Tables (Copy & Paste This)

1. Go to: SQL Editor → New Query
2. DELETE any existing text
3. COPY THE ENTIRE CODE BELOW
4. PASTE into SQL Editor
5. Click RUN button

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fileName TEXT NOT NULL,
  rawText TEXT NOT NULL,
  fileType TEXT,
  fileSize INTEGER,
  uploadedAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create resume_analysis table
CREATE TABLE IF NOT EXISTS resume_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resumeId UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  overallScore TEXT,
  skillsScore TEXT,
  experienceScore TEXT,
  educationScore TEXT,
  formattingScore TEXT,
  strengths TEXT[],
  improvements TEXT[],
  recommendations TEXT[],
  keywordMissing TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create github_profiles table
CREATE TABLE IF NOT EXISTS github_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  name TEXT,
  bio TEXT,
  profileUrl TEXT,
  avatarUrl TEXT,
  publicRepos INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  topLanguages TEXT[],
  recentProjects TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create linkedin_profiles table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  fullName TEXT,
  headline TEXT,
  profileUrl TEXT,
  profileImageUrl TEXT,
  location TEXT,
  about TEXT,
  connections INTEGER DEFAULT 0,
  endorsements INTEGER DEFAULT 0,
  skills TEXT[],
  experience TEXT[],
  education TEXT[],
  certifications TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create job_searches table
CREATE TABLE IF NOT EXISTS job_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  jobType TEXT,
  experience TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  searchedAt TIMESTAMP DEFAULT NOW()
);

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jobTitle TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  description TEXT,
  url TEXT,
  matchScore DECIMAL,
  savedAt TIMESTAMP DEFAULT NOW()
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  totalResumeUploads INTEGER DEFAULT 0,
  totalProfileViews INTEGER DEFAULT 0,
  averageResumeScore DECIMAL DEFAULT 0,
  careerGrowthScore DECIMAL DEFAULT 0,
  jobMatchPercentage DECIMAL DEFAULT 0,
  skillGaps TEXT[],
  topSkills TEXT[],
  activityLog TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create career_tips table
CREATE TABLE IF NOT EXISTS career_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  emailNotifications BOOLEAN DEFAULT true,
  weeklyDigest BOOLEAN DEFAULT true,
  jobRecommendations BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create application_history table
CREATE TABLE IF NOT EXISTS application_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  appliedAt TIMESTAMP,
  status TEXT DEFAULT 'applied',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jobTitle TEXT,
  company TEXT,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create interview_prep table
CREATE TABLE IF NOT EXISTS interview_prep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  questions TEXT[],
  answers TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  imageUrl TEXT,
  demoUrl TEXT,
  githubUrl TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_userId ON resumes(userId);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_userId ON resume_analysis(userId);
CREATE INDEX IF NOT EXISTS idx_job_searches_userId ON job_searches(userId);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_userId ON saved_jobs(userId);
CREATE INDEX IF NOT EXISTS idx_portfolio_userId ON portfolio_items(userId);
```

**EXPECTED RESULT:** Green checkmark saying "Successfully executed 1 query"

---

### STEP 3: Enable Row-Level Security (Copy & Paste This)

1. SQL Editor → New Query
2. DELETE any existing text
3. COPY THE ENTIRE CODE BELOW
4. PASTE into SQL Editor
5. Click RUN button

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_prep ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for resumes table
CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = userId);

-- Create policies for resume_analysis table
CREATE POLICY "Users can view their own analysis"
  ON resume_analysis FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own analysis"
  ON resume_analysis FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own analysis"
  ON resume_analysis FOR UPDATE
  USING (auth.uid() = userId);

-- Create policies for github_profiles table
CREATE POLICY "Users can view their own GitHub profile"
  ON github_profiles FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own GitHub profile"
  ON github_profiles FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own GitHub profile"
  ON github_profiles FOR UPDATE
  USING (auth.uid() = userId);

-- Create policies for linkedin_profiles table
CREATE POLICY "Users can view their own LinkedIn profile"
  ON linkedin_profiles FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own LinkedIn profile"
  ON linkedin_profiles FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own LinkedIn profile"
  ON linkedin_profiles FOR UPDATE
  USING (auth.uid() = userId);

-- Create policies for job_searches table
CREATE POLICY "Users can view their own job searches"
  ON job_searches FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own job searches"
  ON job_searches FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for saved_jobs table
CREATE POLICY "Users can view their own saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own saved jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for user_analytics table
CREATE POLICY "Users can view their own analytics"
  ON user_analytics FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own analytics"
  ON user_analytics FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for career_tips table (public read)
CREATE POLICY "Anyone can view career tips"
  ON career_tips FOR SELECT
  USING (true);

-- Create policies for user_preferences table
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = userId);

-- Create policies for application_history table
CREATE POLICY "Users can view their own applications"
  ON application_history FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own applications"
  ON application_history FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for cover_letters table
CREATE POLICY "Users can view their own cover letters"
  ON cover_letters FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own cover letters"
  ON cover_letters FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for interview_prep table
CREATE POLICY "Users can view their own interview prep"
  ON interview_prep FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own interview prep"
  ON interview_prep FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Create policies for portfolio_items table
CREATE POLICY "Users can view their own portfolio"
  ON portfolio_items FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own portfolio"
  ON portfolio_items FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own portfolio"
  ON portfolio_items FOR UPDATE
  USING (auth.uid() = userId);
```

**EXPECTED RESULT:** Green checkmark saying "Successfully executed 1 query"

---

### STEP 4: Create Storage Buckets

1. In Supabase, click "Storage" on the left sidebar
2. Click "Create a new bucket"

**CREATE FIRST BUCKET:**
- Name: `resumes`
- Make it Public: Toggle ON
- Click "Create bucket"

**CREATE SECOND BUCKET:**
- Name: `portfolio-images`
- Make it Public: Toggle ON
- Click "Create bucket"

**CREATE THIRD BUCKET:**
- Name: `profile-pictures`
- Make it Public: Toggle ON
- Click "Create bucket"

**EXPECTED RESULT:** You see 3 buckets in Storage

---

### VERIFICATION: Phase 1 Complete

Check:
- [ ] Supabase shows 15 tables created
- [ ] RLS policies are showing as "On" in the storage
- [ ] 3 buckets exist: resumes, portfolio-images, profile-pictures
- [ ] All buckets are Public (toggle is ON)

---

# PHASE 2: LOCAL TESTING (5 MINUTES)

## STEP 1: Open Terminal/Command Prompt

**Windows Users:**
- Press: Windows Key + R
- Type: cmd
- Press: Enter
- You see: Command Prompt window

**Mac/Linux Users:**
- Open Applications → Terminal
- Or press: Cmd + Space, type "terminal", press Enter
- You see: Terminal window

---

## STEP 2: Navigate to Your Project

In the terminal, type:
```bash
cd /path/to/your/careerpilot-project
```

Replace `/path/to/your/careerpilot-project` with the actual path to your project folder.

Example:
```bash
cd C:\Users\YourName\Documents\careerpilot
```

Or:
```bash
cd ~/Documents/careerpilot
```

Press: Enter

---

## STEP 3: Install Dependencies

Type this command:
```bash
pnpm install
```

Press: Enter

**What happens:** You'll see many packages downloading and installing. This takes 1-2 minutes.

**EXPECTED OUTPUT:** When done, you see:
```
packages in X.XXs
```

---

## STEP 4: Start Development Server

Type this command:
```bash
pnpm dev
```

Press: Enter

**What happens:** The app builds and starts a development server.

**EXPECTED OUTPUT:** You should see:
```
▲ Next.js X.XX.X

> ready on http://localhost:3000
```

---

## STEP 5: Open App in Browser

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: `http://localhost:3000`
3. You should see the CareerPilot AI landing page

---

## STEP 6: Test Sign Up

1. Click "Sign Up" button on the landing page
2. Fill in the form:
   - Email: `test@example.com` (or any test email)
   - Password: `Test123456`
3. Click "Sign Up"
4. You should be logged in and see the Dashboard

---

## STEP 7: Verify Email Sending

1. Check the email address you used (`test@example.com`)
2. Look for an email from: `noreply@brevo.com`
3. Subject should be: "Welcome to CareerPilot AI"
4. Email might take 1-2 minutes to arrive

**EXPECTED RESULT:** Welcome email in your inbox

---

### VERIFICATION: Phase 2 Complete

Check:
- [ ] pnpm install completed successfully
- [ ] pnpm dev runs and shows "ready on http://localhost:3000"
- [ ] App loads at http://localhost:3000
- [ ] Can sign up and see dashboard
- [ ] Welcome email received from Brevo

---

# PHASE 3: DEPLOY TO PRODUCTION (3 MINUTES)

## STEP 1: Stop Local Server

In your terminal where `pnpm dev` is running:
1. Press: `Ctrl + C` (hold Control, press C)
2. The server stops
3. You see the terminal prompt again

---

## STEP 2: Push Code to GitHub

Type these commands ONE AT A TIME. Press Enter after each.

**Command 1:**
```bash
git add .
```

Wait for the prompt to return (no output = success)

**Command 2:**
```bash
git commit -m "Deploy CareerPilot AI - All fixes applied and ready for production"
```

Wait for output

**Command 3:**
```bash
git push origin main
```

Wait for completion. You should see confirmation that code was pushed.

---

## STEP 3: Vercel Auto-Deploys

1. Go to: `https://vercel.com/dashboard`
2. Click on your CareerPilot project
3. You'll see a deployment starting
4. Watch for a GREEN CHECKMARK that says "Completed"

This takes 2-3 minutes. Don't close the browser.

---

## STEP 4: Test Production App

1. Go to: `https://v0-careerpilot.vercel.app`
2. Test sign up with a different email
3. Verify dashboard loads
4. Check email for welcome message

**EXPECTED RESULT:** App works the same as local version

---

### VERIFICATION: Phase 3 Complete

Check:
- [ ] Git commands completed without error
- [ ] Vercel shows green checkmark (Completed)
- [ ] App loads at https://v0-careerpilot.vercel.app
- [ ] Can sign up in production
- [ ] Welcome email received
- [ ] No errors in Vercel dashboard

---

# COMPLETE VERIFICATION CHECKLIST

Before declaring success, verify EVERYTHING:

## Phase 1 - Database (Supabase)
- [ ] Login to Supabase successful
- [ ] 15 tables created (check in "Table Editor")
- [ ] RLS policies enabled (check in "Storage" → "Policies")
- [ ] 3 storage buckets exist
- [ ] All buckets are Public

## Phase 2 - Local Testing
- [ ] pnpm install - completed without errors
- [ ] pnpm dev - starts and shows "ready on http://localhost:3000"
- [ ] http://localhost:3000 - app loads
- [ ] Sign up works - can create account
- [ ] Dashboard - shows after sign up
- [ ] Welcome email - received from noreply@brevo.com
- [ ] Email - arrives within 2 minutes

## Phase 3 - Production
- [ ] git add . - completed
- [ ] git commit - completed with message
- [ ] git push - uploaded to GitHub
- [ ] Vercel - shows deployment starting
- [ ] Vercel - shows green checkmark "Completed"
- [ ] https://v0-careerpilot.vercel.app - app loads
- [ ] Production signup - works
- [ ] Production welcome email - received
- [ ] Vercel logs - no errors/red text

## Final Checks
- [ ] All above verified
- [ ] App is fully functional
- [ ] Ready for users
- [ ] Have admin access to Supabase
- [ ] Have admin access to Vercel

---

# TROUBLESHOOTING

## Problem: "pnpm: command not found"
**Solution:**
1. Install pnpm: `npm install -g pnpm`
2. Then try `pnpm dev` again

## Problem: Port 3000 is already in use
**Solution:**
1. Kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
2. Or change port: `pnpm dev -p 3001`

## Problem: Database connection error in app
**Solution:**
1. Verify environment variables in .env.development.local
2. Check Supabase credentials are correct
3. Verify all 15 tables exist in Supabase

## Problem: Email not arriving
**Solution:**
1. Check spam/junk folder
2. Wait 2-3 minutes (sometimes delayed)
3. Verify BREVO_API_KEY in Vercel settings

## Problem: RLS policy violation error
**Solution:**
1. Run the RLS SQL script again (Step 3 in Phase 1)
2. Verify auth.uid() is working

## Problem: Build fails on Vercel
**Solution:**
1. Check Vercel deployment logs
2. Run `pnpm build` locally to see error
3. Verify all environment variables in Vercel

## Problem: Can't access Supabase
**Solution:**
1. Check email/password
2. Check account is not locked
3. Use "Forgot password" to reset

## Problem: App loads but no data shows
**Solution:**
1. Verify RLS policies are enabled
2. Check tables have data
3. Check browser console for JavaScript errors

---

# YOU'RE DONE! 🎉

When all checks pass, you have a **PRODUCTION-READY** CareerPilot AI app!

## Summary of What You Have:

✓ 15 database tables with security
✓ Email service sending messages
✓ User authentication system
✓ Resume upload & analysis
✓ Job search functionality
✓ Career coaching AI features
✓ GitHub & LinkedIn integration
✓ Portfolio management
✓ Interview preparation tools
✓ Live production app

## Next Steps:

1. Invite users to sign up
2. Monitor Vercel logs for errors
3. Check Supabase usage metrics
4. Collect user feedback
5. Plan future features

Congratulations! Your CareerPilot AI is now LIVE! 🚀

