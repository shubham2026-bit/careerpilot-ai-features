-- CareerPilot AI - Row Level Security (RLS) Policies
-- Copy and paste this into Supabase SQL Editor after creating tables

-- User Profiles - Users can only view/edit their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Resumes - Users can only access their own resumes
CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Resume Analysis - Users can only access their own analyses
CREATE POLICY "Users can view their own resume analysis"
  ON resume_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analysis"
  ON resume_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume analysis"
  ON resume_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analysis"
  ON resume_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- Skills - Users can only access their own skills
CREATE POLICY "Users can view their own skills"
  ON skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
  ON skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
  ON skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
  ON skills FOR DELETE
  USING (auth.uid() = user_id);

-- Education - Users can only access their own education
CREATE POLICY "Users can view their own education"
  ON education FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education"
  ON education FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education"
  ON education FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education"
  ON education FOR DELETE
  USING (auth.uid() = user_id);

-- Experience - Users can only access their own experience
CREATE POLICY "Users can view their own experience"
  ON experience FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experience"
  ON experience FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experience"
  ON experience FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experience"
  ON experience FOR DELETE
  USING (auth.uid() = user_id);

-- Job Matches - Users can only view their own matches
CREATE POLICY "Users can view their own job matches"
  ON job_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job matches"
  ON job_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job matches"
  ON job_matches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job matches"
  ON job_matches FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Jobs - Users can only view their own saved jobs
CREATE POLICY "Users can view their own saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs"
  ON saved_jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Email Notifications - Users can only view their own
CREATE POLICY "Users can view their own email notifications"
  ON email_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email notifications"
  ON email_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email notifications"
  ON email_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- User Analytics - Users can only view their own analytics
CREATE POLICY "Users can view their own analytics"
  ON user_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
  ON user_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Certifications - Users can only access their own certifications
CREATE POLICY "Users can view their own certifications"
  ON certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certifications"
  ON certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certifications"
  ON certifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certifications"
  ON certifications FOR DELETE
  USING (auth.uid() = user_id);

-- Jobs table - Public read (anyone can view jobs)
CREATE POLICY "Everyone can view jobs"
  ON jobs FOR SELECT
  USING (true);

-- Career Tips - Public read
CREATE POLICY "Everyone can view career tips"
  ON career_tips FOR SELECT
  USING (true);

-- User Career Tips - Users can only manage their own
CREATE POLICY "Users can view their own career tips"
  ON user_career_tips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career tips"
  ON user_career_tips FOR INSERT
  WITH CHECK (auth.uid() = user_id);
