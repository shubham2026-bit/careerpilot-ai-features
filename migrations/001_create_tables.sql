-- CareerPilot AI - Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn Profiles Table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_url TEXT NOT NULL,
  headline TEXT,
  summary TEXT,
  experience JSONB,
  skills JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn Analysis Table
CREATE TABLE IF NOT EXISTS linkedin_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES linkedin_profiles(id) ON DELETE CASCADE,
  overall_score INT,
  strengths TEXT[],
  improvements TEXT[],
  recommendations TEXT[],
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GitHub Profiles Table
CREATE TABLE IF NOT EXISTS github_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  bio TEXT,
  followers INT,
  repositories INT,
  public_repos JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GitHub Analysis Table
CREATE TABLE IF NOT EXISTS github_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES github_profiles(id) ON DELETE CASCADE,
  overall_score INT,
  strengths TEXT[],
  improvements TEXT[],
  recommendations TEXT[],
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Projects Table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  technologies TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Analysis Table
CREATE TABLE IF NOT EXISTS portfolio_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INT,
  strengths TEXT[],
  improvements TEXT[],
  recommendations TEXT[],
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resume Analysis Table
CREATE TABLE IF NOT EXISTS resume_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  overall_score INT,
  strengths TEXT[],
  improvements TEXT[],
  ats_score INT,
  formatting_issues TEXT[],
  recommendations TEXT[],
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_linkedin_profiles_user_id ON linkedin_profiles(user_id);
CREATE INDEX idx_linkedin_analysis_user_id ON linkedin_analysis(user_id);
CREATE INDEX idx_github_profiles_user_id ON github_profiles(user_id);
CREATE INDEX idx_github_analysis_user_id ON github_analysis(user_id);
CREATE INDEX idx_portfolio_projects_user_id ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_analysis_user_id ON portfolio_analysis(user_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resume_analysis_user_id ON resume_analysis(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY user_profiles_select ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY user_profiles_update ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY user_profiles_insert ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY linkedin_profiles_select ON linkedin_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY linkedin_profiles_insert ON linkedin_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY linkedin_profiles_update ON linkedin_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY linkedin_profiles_delete ON linkedin_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY linkedin_analysis_select ON linkedin_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY linkedin_analysis_insert ON linkedin_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY linkedin_analysis_update ON linkedin_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY linkedin_analysis_delete ON linkedin_analysis FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY github_profiles_select ON github_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY github_profiles_insert ON github_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY github_profiles_update ON github_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY github_profiles_delete ON github_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY github_analysis_select ON github_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY github_analysis_insert ON github_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY github_analysis_update ON github_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY github_analysis_delete ON github_analysis FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY portfolio_projects_select ON portfolio_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY portfolio_projects_insert ON portfolio_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY portfolio_projects_update ON portfolio_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY portfolio_projects_delete ON portfolio_projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY portfolio_analysis_select ON portfolio_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY portfolio_analysis_insert ON portfolio_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY portfolio_analysis_update ON portfolio_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY portfolio_analysis_delete ON portfolio_analysis FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY resumes_select ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY resumes_insert ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY resumes_update ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY resumes_delete ON resumes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY resume_analysis_select ON resume_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY resume_analysis_insert ON resume_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY resume_analysis_update ON resume_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY resume_analysis_delete ON resume_analysis FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_delete ON notifications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY user_analytics_select ON user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_analytics_insert ON user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_settings_select ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_settings_insert ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_settings_update ON user_settings FOR UPDATE USING (auth.uid() = user_id);
