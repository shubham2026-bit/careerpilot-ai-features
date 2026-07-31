# Supabase Storage Setup Guide

## Overview
CareerPilot AI uses Supabase Storage for file uploads (resumes, profiles, portfolios). This guide walks you through setting up the necessary storage buckets.

## Step 1: Create Storage Buckets

### 1.1 Resumes Bucket
1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
2. Click **Storage** in the left sidebar
3. Click **Create New Bucket**
4. **Bucket Name:** `resumes`
5. **Public Bucket:** Leave UNCHECKED (private by default)
6. Click **Create**

### 1.2 Portfolio Images Bucket
1. Click **Create New Bucket** again
2. **Bucket Name:** `portfolio-images`
3. **Public Bucket:** Optionally CHECK if you want portfolio images public
4. Click **Create**

### 1.3 Profile Pictures Bucket
1. Click **Create New Bucket**
2. **Bucket Name:** `profile-pictures`
3. **Public Bucket:** CHECK (user avatars should be public)
4. Click **Create**

## Step 2: Configure Storage Policies

### Configure Resumes Bucket Policies
1. Click on `resumes` bucket
2. Click **Policies** tab
3. Click **New Policy** → **For full customization, use custom policy**
4. Paste the following policy:

```sql
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Configure Portfolio Images Bucket Policies
1. Click on `portfolio-images` bucket
2. Click **Policies** tab
3. Add similar policies:

```sql
CREATE POLICY "Users can upload their own portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "Users can delete their own portfolio images"
ON storage.objects FOR DELETE
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Configure Profile Pictures Bucket Policies
1. Click on `profile-pictures` bucket
2. Click **Policies** tab
3. Add policies:

```sql
CREATE POLICY "Users can upload their own profile picture"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "Users can delete their own profile picture"
ON storage.objects FOR DELETE
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Configure CORS (Optional but Recommended)

To allow cross-origin uploads:

1. Go to **Project Settings** → **API**
2. Scroll to **CORS Settings**
3. Add your domain (e.g., `https://v0-careerpilot.vercel.app`)
4. Click **Save**

## Step 4: Verify Setup

Run this test in your browser console:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// Test bucket access
const { data, error } = await supabase.storage.from('resumes').list()
console.log(data, error)
```

## File Upload Examples

### Upload Resume
```typescript
const { data, error } = await supabase.storage
  .from('resumes')
  .upload(`${userId}/resume.pdf`, file)

if (!error) {
  const url = supabase.storage
    .from('resumes')
    .getPublicUrl(`${userId}/resume.pdf`).data.publicUrl
}
```

### Upload Portfolio Image
```typescript
const { data, error } = await supabase.storage
  .from('portfolio-images')
  .upload(`${userId}/${fileName}`, file)
```

### Upload Profile Picture
```typescript
const { data, error } = await supabase.storage
  .from('profile-pictures')
  .upload(`${userId}/avatar.jpg`, file)
```

## Troubleshooting

### Files Not Uploading
- Check RLS policies are enabled
- Verify auth token is valid
- Check file size limits (100MB default)

### Files Not Accessible
- Verify bucket is public (if needed)
- Check storage policies allow read access
- Verify CORS is configured

### Authentication Errors
- Ensure user is signed in
- Check auth token has not expired
- Verify JWT_SECRET is correct
