# CareerPilot AI - Quick Start Guide

Get up and running in 5 minutes.

## Option 1: Local Development (Fastest)

### 1. Clone & Install
```bash
cd careerpilot
pnpm install
```

### 2. Setup Environment
```bash
cat > .env.local << EOF
DATABASE_URL=postgresql://user:pass@localhost/careerpilot
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

### 3. Database Setup
```bash
pnpm db:push
```

### 4. Run
```bash
pnpm dev
```

### 5. Open
Visit http://localhost:3000

---

## Option 2: Deploy to Vercel (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel
- Go to https://vercel.com/new
- Select your repository
- Click "Import"

### 3. Add Environment Variables
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generated>
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Deploy
Click "Deploy"

---

## Minimal Setup (Skip Email for Now)

These 3 variables are mandatory:

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
```

Everything else is optional. Add email later:
```bash
RESEND_API_KEY=re_xxx
```

---

## Key URLs

Once running, access:

| Feature | URL |
|---------|-----|
| Home | http://localhost:3000 |
| Resume | http://localhost:3000/resume |
| LinkedIn | http://localhost:3000/linkedin |
| GitHub | http://localhost:3000/github |
| Portfolio | http://localhost:3000/portfolio |
| Career Coach | http://localhost:3000/career-coach |
| Notifications | http://localhost:3000/notifications |
| Analytics | http://localhost:3000/analytics |
| Settings | http://localhost:3000/settings |

---

## Test the Features

### 1. Resume Analysis
1. Go to `/resume`
2. Upload a resume (use test-resume.txt)
3. See instant AI analysis

### 2. AI Coach
1. Go to `/career-coach`
2. Ask "How can I improve my resume?"
3. Get AI response in real-time

### 3. Notifications
1. Go to `/notifications`
2. See sample notifications
3. Mark as read

### 4. Analytics
1. Go to `/analytics`
2. View career metrics
3. See trend charts

---

## Database Inspection

View your database:
```bash
pnpm db:studio
```

This opens Drizzle Studio where you can:
- View all tables
- See data
- Run queries
- Edit records

---

## Debugging

### Check Console
Look for `[v0]` messages:
```bash
console.log("[v0] Resume uploaded:", resumeId)
```

### View Logs
```bash
tail -f .next/server/server-request-handler.log
```

### Check Environment
```bash
env | grep -E 'DATABASE|AUTH|RESEND|APP'
```

---

## Common Issues

### "Database connection failed"
- Verify DATABASE_URL format
- Check Neon connection is active
- Ensure IP allowlist configured

### "Auth error"
- Generate new BETTER_AUTH_SECRET
- Verify BETTER_AUTH_URL matches
- Clear browser cookies

### "Chat not working"
- Build with `pnpm build`
- Check browser DevTools
- Verify API route exists

---

## Next Steps

After setup:

1. **Upload a Resume**
   - Go to `/resume`
   - Get instant AI analysis

2. **Try the AI Coach**
   - Go to `/career-coach`
   - Ask any career question

3. **Configure Email** (optional)
   - See EMAIL_SETUP.md
   - Add RESEND_API_KEY

4. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Add custom domain

---

## Documentation

Need more details?

- `README.md` - Full setup guide
- `PROJECT_SUMMARY.md` - Feature overview
- `SYSTEM_OVERVIEW.md` - Architecture
- `EMAIL_SETUP.md` - Email config
- `DEPLOYMENT.md` - Production
- `FINAL_SUMMARY.md` - Complete summary

---

## Commands Reference

```bash
# Development
pnpm dev              # Start server
pnpm build            # Build for prod
pnpm start            # Run production

# Database
pnpm db:push          # Apply changes
pnpm db:studio        # View database

# Code Quality
pnpm lint             # Lint code
pnpm type-check       # Check types
pnpm format           # Format code
```

---

## Environment Variables Explained

| Variable | What It Is | How to Get |
|----------|-----------|-----------|
| `DATABASE_URL` | Database connection | Create Neon database |
| `BETTER_AUTH_SECRET` | Encryption key | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Same as BETTER_AUTH_URL |
| `RESEND_API_KEY` | Email service | Sign up at resend.com |

---

## Features Checklist

After setup, test these:

- [ ] Register new account
- [ ] Upload resume
- [ ] See resume analysis
- [ ] Chat with AI coach
- [ ] View notifications
- [ ] Check analytics
- [ ] Update settings
- [ ] (Optional) Send email

---

## Getting Help

1. Check console for `[v0]` logs
2. Review error messages
3. Check documentation
4. Verify environment variables
5. Run `pnpm db:studio` to inspect database

---

## Performance Tips

- Resume uploads are instant
- AI responses stream in real-time
- Analytics load in < 1 second
- Database queries cached automatically
- Assets served via CDN

---

## Security Notes

- Never commit .env files
- Keep BETTER_AUTH_SECRET secret
- Don't share API keys
- Use HTTPS in production
- Enable 2FA for Vercel account

---

## Ready?

You're all set! Start here:

```bash
# 1. Install
pnpm install

# 2. Setup env
cp .env.example .env.local
# Edit .env.local with your values

# 3. Database
pnpm db:push

# 4. Run
pnpm dev

# 5. Visit
# http://localhost:3000
```

**Welcome to CareerPilot AI!**

Questions? Check the full documentation files in the project root.
