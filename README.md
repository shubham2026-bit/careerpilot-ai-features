# CareerPilot AI

Your complete AI-powered career intelligence platform. Upload resumes, analyze profiles, get AI coaching, and receive personalized career insights all in one place.

## Features

### 📄 Resume Intelligence
- Drag-and-drop resume upload (PDF/TXT)
- AI-powered analysis with 5-dimensional scoring
- Detailed insights: strengths, improvements, recommendations
- Score tracking and history

### 🔗 Profile Analysis
- **LinkedIn**: Profile strength scoring with completeness, visibility, and engagement metrics
- **GitHub**: Developer score with code quality, activity, and language diversity analysis
- **Portfolio**: Project showcase with presentation and impact scoring

### 🤖 AI Career Coach
- Real-time chat with AI career advisor
- Expert guidance on interviews, salary, transitions, and skills
- Powered by OpenAI GPT-5-mini
- Available 24/7

### 📊 Analytics & Insights
- Career growth dashboard with trending metrics
- Job match tracking
- Skill gap analysis
- Weekly activity summaries

### 🔔 Notifications & Email
- Real-time in-app notifications
- Automated emails: resume analysis, job matches, weekly digest
- User-controlled preferences
- Integrated notification center

### ⚙️ Settings & Preferences
- Email notification controls
- Privacy and data preferences
- Theme selection (light/dark/system)
- Language selection

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, API Routes
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Authentication**: Better Auth
- **AI**: AI SDK 6, OpenAI GPT-5-mini
- **Email**: Resend
- **Animations**: Framer Motion
- **Charts**: Recharts

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database (Neon recommended)
- OpenAI API access

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd careerpilot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your values:
   ```
   DATABASE_URL=postgresql://user:password@host/db
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   BETTER_AUTH_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Setup database**
   ```bash
   pnpm db:push
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**
   Visit http://localhost:3000

## Project Structure

```
careerpilot/
├── app/
│   ├── (dashboard)/          # Dashboard pages
│   │   ├── resume/
│   │   ├── linkedin/
│   │   ├── github/
│   │   ├── portfolio/
│   │   ├── career-coach/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   └── settings/
│   ├── api/                  # API routes
│   │   ├── chat/             # AI chat endpoint
│   │   └── auth/             # Auth routes
│   ├── actions/              # Server actions
│   │   ├── resume-actions.ts
│   │   ├── profile-actions.ts
│   │   ├── notification-actions.ts
│   │   ├── analytics-actions.ts
│   │   ├── settings-actions.ts
│   │   └── email-notification-actions.ts
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── resume/               # Resume components
│   ├── profiles/             # Profile analyzers
│   ├── chat/                 # Chat interface
│   ├── notifications/        # Notification UI
│   ├── analytics/            # Dashboard components
│   ├── settings/             # Settings components
│   └── ui/                   # shadcn components
│
├── lib/
│   ├── db/
│   │   ├── schema.ts         # Database schema
│   │   └── index.ts          # DB client
│   ├── email/                # Email templates & service
│   │   ├── email-service.ts
│   │   └── templates/
│   ├── auth.ts               # Auth config
│   └── utils.ts
│
├── PROJECT_SUMMARY.md        # Project overview
├── SYSTEM_OVERVIEW.md        # Architecture guide
├── EMAIL_SETUP.md            # Email configuration
├── DEPLOYMENT.md             # Deployment guide
└── README.md
```

## Available Routes

### Dashboard Pages
- `/resume` - Resume upload and analysis
- `/linkedin` - LinkedIn profile connection
- `/github` - GitHub profile analysis
- `/portfolio` - Portfolio project management
- `/career-coach` - AI chat interface
- `/notifications` - Notification center
- `/analytics` - Metrics and insights
- `/settings` - User preferences

### API Endpoints
- `/api/chat` - AI chat streaming endpoint
- `/api/auth/*` - Authentication endpoints

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check

# Database
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio

# Format code
pnpm format
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Auth encryption key | Yes |
| `BETTER_AUTH_URL` | App URL for auth callbacks | Yes |
| `RESEND_API_KEY` | Email service API key | No (for email) |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |

## Configuration Files

- `.env.local` - Environment variables
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind CSS config
- `next.config.mjs` - Next.js config
- `components.json` - shadcn config
- `.eslintrc.json` - ESLint config

## Database Schema

Key tables:
- `resumes` - User resumes
- `resumeAnalysis` - Analysis results
- `linkedinProfiles` / `linkedinAnalysis` - LinkedIn data
- `githubProfiles` / `githubAnalysis` - GitHub data
- `portfolioProjects` / `portfolioAnalysis` - Portfolio data
- `notifications` - User notifications
- `userAnalytics` - User metrics
- `userSettings` - User preferences

See `SYSTEM_OVERVIEW.md` for complete schema details.

## Email Setup

To enable email notifications:

1. Sign up at [Resend.com](https://resend.com)
2. Get API key
3. Add `RESEND_API_KEY` to environment
4. See `EMAIL_SETUP.md` for detailed configuration

## Deployment

To deploy to production:

1. See `DEPLOYMENT.md` for complete deployment guide
2. Key steps:
   - Push code to GitHub
   - Connect Vercel project
   - Configure environment variables
   - Deploy via Vercel

## Performance Tips

- Resume uploads are optimized for files up to 10MB
- AI chat responses stream for instant feedback
- Database queries use connection pooling
- Assets are cached with CDN
- Images are optimized on the fly

## Security

- Passwords hashed with Better Auth
- Session-based authentication
- All API routes require authentication
- User data scoped by userId
- Environment secrets never exposed
- HTTPS/TLS in production

## Troubleshooting

### "Missing API Key" Error
Add `BETTER_AUTH_SECRET` and `RESEND_API_KEY` to `.env.local`

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check network access from Vercel
- Ensure IP allowlist configured

### Resume Upload Fails
- Check file size (max 10MB)
- Verify file format (PDF/TXT)
- Check storage permissions

### Chat Not Working
- Verify AI SDK is installed
- Check API responses in DevTools
- Review console logs for `[v0]` messages

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open pull request

## Documentation

- `PROJECT_SUMMARY.md` - High-level project overview
- `SYSTEM_OVERVIEW.md` - Architecture and data flow
- `EMAIL_SETUP.md` - Email configuration guide
- `DEPLOYMENT.md` - Production deployment guide

## Support

For issues or questions:
1. Check documentation files
2. Review console logs for errors
3. Check environment variables
4. Look for `[v0]` debug messages

## License

MIT

## Acknowledgments

Built with:
- Next.js and React
- OpenAI for AI capabilities
- Vercel for hosting and AI Gateway
- Neon for database
- Resend for email
- All open-source dependencies

---

**CareerPilot AI** - Your AI-powered career intelligence platform
*Built to help professionals track, improve, and advance their careers*

[View Documentation](./PROJECT_SUMMARY.md) | [Deploy Now](https://vercel.com/new) | [Report Issues](https://github.com/issues)
