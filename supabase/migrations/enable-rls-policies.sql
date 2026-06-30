-- Enable Row Level Security (RLS) on all tables
-- This is a CRITICAL security fix for production

-- 1. Enable RLS on user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own profile" ON "user" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can only update their own profile" ON "user" FOR UPDATE USING (auth.uid()::text = id);

-- 2. Enable RLS on profiles table
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see all profiles" ON "profiles" FOR SELECT USING (true);
CREATE POLICY "Users can only update their own profile" ON "profiles" FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can only insert their own profile" ON "profiles" FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can only delete their own profile" ON "profiles" FOR DELETE USING (auth.uid()::text = id);

-- 3. Enable RLS on resumes table
ALTER TABLE "resumes" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own resumes" ON "resumes" FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert their own resumes" ON "resumes" FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update their own resumes" ON "resumes" FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete their own resumes" ON "resumes" FOR DELETE USING (auth.uid()::text = user_id);

-- 4. Enable RLS on career_goals table
ALTER TABLE "career_goals" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own career goals" ON "career_goals" FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert their own career goals" ON "career_goals" FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update their own career goals" ON "career_goals" FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete their own career goals" ON "career_goals" FOR DELETE USING (auth.uid()::text = user_id);

-- 5. Enable RLS on job_applications table
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own job applications" ON "job_applications" FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert their own job applications" ON "job_applications" FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update their own job applications" ON "job_applications" FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete their own job applications" ON "job_applications" FOR DELETE USING (auth.uid()::text = user_id);

-- 6. Enable RLS on interview_prep table
ALTER TABLE "interview_prep" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own interview prep" ON "interview_prep" FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert their own interview prep" ON "interview_prep" FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update their own interview prep" ON "interview_prep" FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete their own interview prep" ON "interview_prep" FOR DELETE USING (auth.uid()::text = user_id);

-- 7. Session table - restrict to auth system
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions are managed by auth system" ON "session" FOR SELECT USING (auth.uid()::text = "userId");

-- 8. Account table - restrict to auth system  
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accounts are managed by auth system" ON "account" FOR SELECT USING (auth.uid()::text = "userId");

-- 9. Verification table - allow auth system
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verification is public for auth flow" ON "verification" FOR SELECT USING (true);
CREATE POLICY "Verification can be inserted by anon" ON "verification" FOR INSERT WITH CHECK (true);

-- 10. Create admin role (optional, for future use)
-- Note: In production, you'd want to add an is_admin field to the user table
-- ALTER TABLE "user" ADD COLUMN is_admin BOOLEAN DEFAULT false;
-- CREATE POLICY "Only admins can see admin stats" ON "user" FOR SELECT USING (is_admin = true);
