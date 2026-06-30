# Complete Environment Variables Guide for CareerPilot AI

## Currently Set Environment Variables

These are already configured in your Vercel project:

```bash
# Supabase Configuration (Already Set)
NEXT_PUBLIC_SUPABASE_URL=https://chogupjjindroxqkdxjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Database
DATABASE_URL=postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres

# Email Service
RESEND_API_KEY=re_jEeaMzNs_NvEY94VeoZ6ZxYsxrWErQDry

# App URL (for OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production domain
```

## Environment Variables Needed for Full Features

Add these to your Vercel project settings:

### OAuth Integration

```bash
# GitHub OAuth
GITHUB_OAUTH_CLIENT_ID=<get-from-github.com/settings/developers>
GITHUB_OAUTH_CLIENT_SECRET=<get-from-github.com/settings/developers>

# LinkedIn OAuth
LINKEDIN_OAUTH_CLIENT_ID=<get-from-linkedin-developers.com>
LINKEDIN_OAUTH_CLIENT_SECRET=<get-from-linkedin-developers.com>
```

### AI & LLM Models

```bash
# For GPT-4 and other OpenAI models via AI Gateway
# (Already working via Vercel AI Gateway - no key needed for basic models)

# Optional: Direct OpenAI API (if not using AI Gateway)
OPENAI_API_KEY=sk-...

# Optional: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
```

### Storage (Optional - for Supabase Bucket)

```bash
# Supabase Storage Configuration (for resume uploads)
SUPABASE_STORAGE_BUCKET=resumes
```

## How to Get Each Environment Variable

### GITHUB_OAUTH_CLIENT_ID & GITHUB_OAUTH_CLIENT_SECRET

1. Go to https://github.com/settings/developers
2. Click "New GitHub App"
3. Fill in:
   - App name: CareerPilot AI
   - Homepage URL: Your app URL
   - Callback URL: `https://yourdomain.com/api/auth/github/callback`
4. Copy the Client ID and generate a Client Secret
5. Add to Vercel environment variables

### LINKEDIN_OAUTH_CLIENT_ID & LINKEDIN_OAUTH_CLIENT_SECRET

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in required information
4. In "Auth" tab, add Redirect URL: `https://yourdomain.com/api/auth/linkedin/callback`
5. Copy Client ID and Client Secret
6. Add to Vercel environment variables

### OPENAI_API_KEY (Optional)

1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Add to Vercel environment variables

### ANTHROPIC_API_KEY (Optional)

1. Go to https://console.anthropic.com/account/keys
2. Create a new API key
3. Add to Vercel environment variables

### GOOGLE_GENERATIVE_AI_API_KEY (Optional)

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create a new API key
4. Add to Vercel environment variables

## How to Add Environment Variables to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on "CareerPilot AI" project
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
5. Enter the key and value
6. Select environments (Production, Preview, Development)
7. Click "Save"
8. Redeploy for changes to take effect

## Production Checklist

Before deploying to production, ensure:

- [ ] All Supabase variables are set
- [ ] Resend API key is configured
- [ ] GitHub OAuth credentials are added
- [ ] LinkedIn OAuth credentials are added (if using LinkedIn features)
- [ ] NEXT_PUBLIC_APP_URL is set to your production domain
- [ ] Database backups are configured in Supabase
- [ ] Email templates are tested in Resend
- [ ] Rate limiting is configured (if needed)

## Testing Environment Variables

To verify variables are loaded correctly:

```bash
# In your Next.js app, you can check during build
npm run build

# Check that no "undefined" errors appear in console
```

## Troubleshooting

**OAuth redirect not working?**
- Check that callback URLs exactly match in both OAuth provider and code
- Verify NEXT_PUBLIC_APP_URL matches your domain
- Clear browser cache and cookies

**Email not sending?**
- Verify RESEND_API_KEY is correct
- Check that sender email is verified in Resend dashboard
- Check email spam folder

**AI not working?**
- Verify you're using Vercel AI Gateway (default)
- Or add OpenAI/Anthropic API keys if using directly
- Check rate limits on AI provider dashboard

