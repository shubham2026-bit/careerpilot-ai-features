# CareerPilot AI - Deployment Guide

## Overview

CareerPilot AI is a complete career intelligence platform ready for production deployment on Vercel. This guide covers all deployment options and configuration steps.

## Prerequisites

- Vercel account
- Neon PostgreSQL database
- Resend email API key
- GitHub account (for GitHub integration via OAuth)

## Quick Deploy to Vercel

### Option 1: Deploy with Git

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Select your GitHub repository
5. Configure environment variables (see below)
6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
npm i -g vercel
vercel
```

## Environment Variables

Create the following environment variables in Vercel:

### Database
```
DATABASE_URL=postgresql://user:password@neon-db.neon.tech/careerdb
```

### Authentication
```
BETTER_AUTH_SECRET=your_super_secret_key_generate_with_openssl
BETTER_AUTH_URL=https://your-domain.vercel.app
```

### Email
```
RESEND_API_KEY=re_your_resend_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Generate Secure Keys

**BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Database Setup

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create new project
3. Copy connection string
4. Add to `DATABASE_URL` in Vercel

### 2. Run Migrations

After deployment:

```bash
# In your production environment
pnpm db:push
```

Or use the Vercel CLI:

```bash
vercel env ls
vercel env pull .env.local
pnpm db:push
```

## Email Configuration

### Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Get API key from dashboard
3. Add to Vercel environment variables
4. For production, add and verify your domain

### Email Templates

Email templates are automatically processed. No additional setup needed.

## Domain Configuration

### Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Update `NEXT_PUBLIC_APP_URL` to your domain

### SSL/TLS

Automatically configured by Vercel - no action needed.

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] All environment variables set
- [ ] Email service verified
- [ ] Test resume upload flow
- [ ] Test AI chat functionality
- [ ] Test email notifications
- [ ] Configure analytics
- [ ] Set up monitoring

## Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection | `postgresql://...` |
| `BETTER_AUTH_SECRET` | Auth encryption key | Generated with openssl |
| `BETTER_AUTH_URL` | App URL for auth redirects | `https://app.com` |
| `RESEND_API_KEY` | Email service API key | `re_xxx...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://app.com` |

## Monitoring & Logs

### Vercel Logs

```bash
vercel logs [project-name]
```

### Database Logs

Check Neon dashboard for query performance and errors.

### Email Logs

Check Resend dashboard for email delivery status.

## Performance Optimization

### Caching Strategy

- Database queries cached with Drizzle ORM
- API responses with Next.js ISR
- Static assets with CDN (automatic)

### Database Optimization

- Indexes on frequently queried fields
- Connection pooling via Neon

### Frontend Optimization

- Code splitting
- Image optimization
- CSS/JS minification (automatic)

## Scaling

### Increasing Resources

- **Database**: Upgrade Neon plan
- **Compute**: Vercel Pro plan for higher limits
- **Email**: Upgrade Resend plan

### Load Testing

```bash
# Use artillery for load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.vercel.app
```

## Security

### Best Practices

- Environment variables never in code
- HTTPS/TLS for all traffic
- Database connection strings never exposed
- API rate limiting (implement as needed)
- User password hashing via Better Auth

### Database Security

- Row-level security (can be added)
- Encrypted connections only
- Regular backups (Neon automated)

## Rollback Strategy

### Revert to Previous Deployment

```bash
# In Vercel dashboard
# Deployments → Select previous deployment → Promote
```

### Database Rollback

Keep migration scripts for rollback:

```bash
# Manual rollback (if needed)
pnpm db:push --force
```

## Troubleshooting

### Deployment Failed

1. Check build logs in Vercel
2. Verify environment variables set
3. Check for TypeScript errors
4. Run `pnpm build` locally first

### Database Connection Error

1. Verify DATABASE_URL is correct
2. Check Neon connection limits
3. Ensure IP allowlist configured
4. Test connection string locally

### Email Not Sending

1. Verify RESEND_API_KEY
2. Check user preferences
3. Verify sender domain configured
4. Check Resend dashboard logs

### Auth Issues

1. Verify BETTER_AUTH_SECRET set
2. Ensure BETTER_AUTH_URL matches domain
3. Check callback URLs configured
4. Clear browser cookies and retry

## Advanced Configuration

### Custom Domain Email

Update sender email in `lib/email/email-service.ts`:

```typescript
from: 'noreply@yourdomain.com'
```

### Rate Limiting

Add to API routes as needed:

```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
})
```

### Cron Jobs (Scheduled Tasks)

Use Vercel Cron functions for:
- Weekly digest emails
- Job matching algorithms
- Analytics aggregation

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## Deployment Checklist

Before going to production:

- [ ] Code review completed
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Email service tested
- [ ] Custom domain configured
- [ ] SSL certificate valid
- [ ] Error handling configured
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

---

**Need help?** Check the project documentation files:
- `PROJECT_SUMMARY.md` - Project overview
- `EMAIL_SETUP.md` - Email configuration
- `README.md` - Development guide
