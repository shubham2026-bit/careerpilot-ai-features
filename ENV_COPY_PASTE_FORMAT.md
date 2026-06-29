# Environment Variables - Copy & Paste Format

This file contains all environment variables needed for CareerPilot AI with copy-paste ready formats.

---

## Already Set (You Already Have These)

These 5 variables are already configured in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://chogupjjindroxqkdxjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres
RESEND_API_KEY=re_jEeaMzNs_NvEY94VeoZ6ZxYsxrWErQDry
```

---

## Need To Add (5 Variables)

Follow these steps to get each variable, then copy-paste into Vercel.

### 1. GITHUB OAuth Variables

**Step 1: Go to GitHub Settings**
```
https://github.com/settings/developers
```

**Step 2: Click "New OAuth App"**

**Step 3: Fill in form:**
- Application name: `CareerPilot AI`
- Homepage URL: `https://yourdomain.com` (or http://localhost:3000 for local)
- Authorization callback URL: `https://yourdomain.com/api/auth/github/callback`

**Step 4: Copy and paste into Vercel:**

```
GITHUB_OAUTH_CLIENT_ID=Iv1.your_github_client_id_here
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret_here
```

Replace:
- `Iv1.your_github_client_id_here` with your actual Client ID
- `your_github_client_secret_here` with your actual Client Secret

---

### 2. LINKEDIN OAuth Variables

**Step 1: Go to LinkedIn Developer Portal**
```
https://www.linkedin.com/developers/apps
```

**Step 2: Click "Create App"**

**Step 3: Fill in:**
- App name: `CareerPilot AI`
- LinkedIn Page: (select or create)
- App logo: (upload any logo)

**Step 4: Go to "Auth" tab and add Authorized redirect URLs:**
```
https://yourdomain.com/api/auth/linkedin/callback
```

**Step 5: Go to "Settings" tab and find:**
- Client ID
- Client Secret

**Step 6: Copy and paste into Vercel:**

```
LINKEDIN_OAUTH_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_OAUTH_CLIENT_SECRET=your_linkedin_client_secret_here
```

Replace:
- `your_linkedin_client_id_here` with your actual Client ID
- `your_linkedin_client_secret_here` with your actual Client Secret

---

### 3. CRON_SECRET (Generate Random String)

Generate a random secret for cron jobs. Use one of these methods:

**Option A: Using OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option B: If you don't have OpenSSL, use this online generator:**
```
https://www.random.org/strings/
```
Generate: 1 string, 32 characters, alphanumeric + symbols

**Copy into Vercel:**

```
CRON_SECRET=your_random_32_char_string_here
```

Example (generate your own!):
```
CRON_SECRET=AbC1D2eF3gH4iJ5kL6mN7oP8qR9sT0uV==
```

---

## Complete Copy-Paste Template

Once you have all credentials, copy this entire block:

```
NEXT_PUBLIC_SUPABASE_URL=https://chogupjjindroxqkdxjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres
RESEND_API_KEY=re_jEeaMzNs_NvEY94VeoZ6ZxYsxrWErQDry
GITHUB_OAUTH_CLIENT_ID=Iv1.your_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret
LINKEDIN_OAUTH_CLIENT_ID=your_linkedin_client_id
LINKEDIN_OAUTH_CLIENT_SECRET=your_linkedin_client_secret
CRON_SECRET=your_random_32_char_string
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## How to Add to Vercel

### Step 1: Go to Project Settings
1. Visit: https://vercel.com/dashboard
2. Select your CareerPilot AI project
3. Click "Settings" (top right)
4. Click "Environment Variables" (left sidebar)

### Step 2: Add Variables
Click "Add New" for each variable:

For `GITHUB_OAUTH_CLIENT_ID`:
- Name: `GITHUB_OAUTH_CLIENT_ID`
- Value: `Iv1.xxxxx...`
- Check: "Production", "Preview", "Development"
- Click "Save"

Repeat for all 5 variables:
1. GITHUB_OAUTH_CLIENT_ID
2. GITHUB_OAUTH_CLIENT_SECRET
3. LINKEDIN_OAUTH_CLIENT_ID
4. LINKEDIN_OAUTH_CLIENT_SECRET
5. CRON_SECRET

### Step 3: Redeploy
1. Go back to "Deployments"
2. Click the 3 dots on latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

---

## Verify Setup

After adding variables and redeploying:

1. Visit: `https://yourdomain.com/login`
2. Look for "GitHub" and "LinkedIn" buttons
3. Click GitHub - should redirect to GitHub login
4. After login, should redirect back to your app

If buttons don't appear or errors occur:
- Check Vercel logs
- Verify all 5 variables are set
- Check redirect URLs match exactly

---

## Quick Reference

| Variable | Type | Example |
|----------|------|---------|
| GITHUB_OAUTH_CLIENT_ID | GitHub | `Iv1.8a9c0e1f2b3c4d5e` |
| GITHUB_OAUTH_CLIENT_SECRET | GitHub | `abc123def456ghi789jkl` |
| LINKEDIN_OAUTH_CLIENT_ID | LinkedIn | `12345678901234` |
| LINKEDIN_OAUTH_CLIENT_SECRET | LinkedIn | `AbCdEfGhIjKlMnOp` |
| CRON_SECRET | Generated | `xyz789uvw012rst345qpq==` |
| NEXT_PUBLIC_APP_URL | Your Domain | `https://careerpilot.ai` |

---

## Troubleshooting

**OAuth buttons not appearing?**
- Check all 5 variables are set
- Redeploy after adding variables
- Check browser console for errors

**GitHub login not working?**
- Verify redirect URL: `https://yourdomain.com/api/auth/github/callback`
- Check client ID and secret are correct
- Make sure app is public

**LinkedIn login not working?**
- Verify redirect URL: `https://yourdomain.com/api/auth/linkedin/callback`
- Check app status (should be approved)
- Verify client ID and secret match

**Cron jobs not running?**
- Check CRON_SECRET is set
- Check Vercel logs for cron errors
- Verify route exists: `/api/cron/weekly-digest`

---

## Support

If you need help:
1. Check Vercel logs: https://vercel.com/dashboard
2. Review error messages
3. Verify all variables are exactly as shown
4. Test with curl: `curl https://yourdomain.com/api/cron/weekly-digest`

