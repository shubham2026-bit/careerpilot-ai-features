# CareerPilot AI - Deployment Steps

## Pre-Deployment Checklist (Complete in Order)

### Phase 1: Local Setup (15 minutes)

- [ ] Clone repository and install dependencies
  ```bash
  git clone <repo>
  cd careerpilot-ai-features
  pnpm install
  ```

- [ ] Copy environment template
  ```bash
  cp .env.example .env.development.local
  ```

- [ ] Fill in Supabase credentials
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

- [ ] Generate BETTER_AUTH_SECRET
  ```bash
  openssl rand -base64 32
  # Paste output into .env.development.local
  ```

- [ ] Fill in Brevo API key
  - Get from: https://app.brevo.com/settings/users/api

- [ ] Fill in Google AI API key
  - Get from: https://makersuite.google.com/app/apikey

- [ ] Fill in GitHub OAuth credentials
  - Create app at: https://github.com/settings/developers
  - Add redirect URL: `https://YOUR_APP_URL/api/auth/callback/github`

- [ ] Verify build succeeds
  ```bash
  pnpm build
  # Should show: "✓ Compiled successfully"
  ```

### Phase 2: Supabase Setup (20 minutes)

- [ ] Create tables
  1. Go to Supabase SQL Editor
  2. Run `/migrations/001_create_tables.sql`
  3. Verify all tables appear in Table Editor

- [ ] Setup RLS policies
  1. Go to Supabase SQL Editor
  2. Run `/migrations/002_setup_rls_policies.sql`
  3. Verify policies appear in each table

- [ ] Create storage buckets
  1. Create `resumes` bucket (private)
  2. Create `portfolio-images` bucket
  3. Create `profile-pictures` bucket
  4. Configure RLS policies for each
  5. Test file upload/download

### Phase 3: Local Testing (10 minutes)

- [ ] Start dev server
  ```bash
  pnpm dev
  # Should run on http://localhost:3000
  ```

- [ ] Test signup flow
  1. Go to http://localhost:3000
  2. Click "Sign Up"
  3. Create test account
  4. Verify email received (check Brevo)
  5. Verify user in Supabase `user_profiles` table

- [ ] Test resume upload
  1. Go to Dashboard → Resume
  2. Upload a test resume
  3. Verify file in Storage → `resumes` bucket
  4. Verify entry in `resumes` table

- [ ] Test email notifications
  1. Complete profile action
  2. Check email inbox
  3. Verify `email_notifications` table has record

- [ ] Check console for errors
  ```bash
  # In browser DevTools Console
  # Should show no red errors
  ```

### Phase 4: Vercel Deployment (5 minutes)

- [ ] Add environment variables to Vercel
  1. Go to https://vercel.com/dashboard
  2. Select project: `careerpilot-ai-features`
  3. Click Settings → Environment Variables
  4. Add all variables from `.env.development.local`
  5. **Important:** Save each one

- [ ] Push to main branch
  ```bash
  git push origin main
  ```
  OR if using v0 branch:
  ```bash
  git push origin v0/careerpilot03503-9400-446582a0
  ```

- [ ] Monitor deployment
  1. Go to Vercel Deployments
  2. Watch build progress
  3. Click "Visit" when complete
  4. Test signup and features

- [ ] Verify production environment variables
  ```
  https://your-deployment.vercel.app/api/health
  # Should return 200 OK
  ```

### Phase 5: Post-Deployment (5 minutes)

- [ ] Test all critical flows
  - [ ] User registration
  - [ ] Email notifications
  - [ ] Resume upload
  - [ ] Profile updates
  - [ ] Dashboard access

- [ ] Monitor error logs
  1. Go to Vercel → Logs
  2. Check for any errors or warnings
  3. Fix critical issues immediately

- [ ] Test OAuth (if enabled)
  - [ ] GitHub login
  - [ ] LinkedIn login
  - [ ] Profile sync

- [ ] Setup monitoring
  - [ ] Enable Vercel Analytics
  - [ ] Monitor API response times
  - [ ] Check error rates

## Environment Variables by Environment

### Development (.env.development.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://njoghcklnnskzlxklfrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
BETTER_AUTH_SECRET=your_secret
BREVO_API_KEY=your_key
GOOGLE_GENERATIVE_AI_API_KEY=your_key
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
LINKEDIN_OAUTH_CLIENT_ID=your_id
LINKEDIN_OAUTH_CLIENT_SECRET=your_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_cron_secret
```

### Production (Vercel)
Same as development, but with:
```
NEXT_PUBLIC_APP_URL=https://v0-careerpilot.vercel.app
```

## Troubleshooting

### Build Fails
```
Error: Cannot find module...
Solution: pnpm install && pnpm build
```

### Database Connection Error
```
Error: Failed to connect to Supabase
Solution: 
1. Verify SUPABASE_URL is correct
2. Check SUPABASE_SERVICE_ROLE_KEY is valid
3. Ensure tables exist in Supabase
```

### RLS Policy Error
```
Error: Rows not found (403)
Solution: 
1. Check RLS policies are enabled
2. Verify user_id matches auth.uid()
3. Test with service role key first
```

### Email Not Sending
```
Error: Failed to send email
Solution:
1. Check BREVO_API_KEY is valid
2. Verify sender email is configured in Brevo
3. Check email_notifications table for errors
```

### Storage Upload Fails
```
Error: Bucket not found
Solution:
1. Verify bucket name is lowercase
2. Check storage policies exist
3. Ensure auth token is valid
```

## Performance Checklist

- [ ] Database indexes created (all tables indexed on user_id)
- [ ] RLS policies optimized (no N+1 queries)
- [ ] API routes cached with revalidateTag()
- [ ] Images optimized with next/image
- [ ] Code splitting working (check in Network tab)
- [ ] Database queries < 100ms
- [ ] API responses < 200ms

## Security Checklist

- [ ] Never commit .env files to git
- [ ] Environment variables in Vercel
- [ ] RLS policies enabled on all tables
- [ ] CORS configured properly
- [ ] HTTPS enforced (Vercel default)
- [ ] Rate limiting enabled (if needed)
- [ ] API keys rotated regularly
- [ ] Database backups enabled

## Success Indicators

✅ Deployment successful when:
1. Website loads at your URL
2. Can create new user account
3. Received welcome email
4. Can upload resume
5. Can update profile
6. Email notifications working
7. No errors in Vercel logs
8. Response times < 500ms

## Next Steps

1. **Invite Beta Users** (Day 1)
   - Test with 5-10 real users
   - Collect feedback
   - Monitor for bugs

2. **Optimize Performance** (Week 1)
   - Analyze Vercel Analytics
   - Optimize slow queries
   - Improve UI responsiveness

3. **Add OAuth** (Week 2)
   - Complete GitHub integration
   - Add LinkedIn integration
   - Test profile sync

4. **Integrate Real Job Data** (Week 3)
   - Connect Indeed API
   - Add job matching algorithm
   - Test recommendations

5. **AI Features** (Week 4)
   - Implement coaching AI
   - Add resume suggestions
   - Career path planning

## Support & Help

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Brevo Docs: https://www.brevo.com/docs/
- Vercel Docs: https://vercel.com/docs

Questions? Check the logs! Most issues are in:
- Browser DevTools Console (client errors)
- Vercel Logs (server errors)
- Supabase Logs (database errors)
- Brevo Dashboard (email issues)
