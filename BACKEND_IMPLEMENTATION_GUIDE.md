# CareerPilot AI - Backend Implementation Guide

## Overview

This guide outlines the production-ready backend architecture and implementation status of CareerPilot AI. The backend has been refactored to follow best practices with centralized services, validation, error handling, and logging.

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│      API Routes (Next.js)              │
│  /api/resume, /api/jobs, /api/ai       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Middleware Layer                  │
│  - Authentication                      │
│  - Error Handling                      │
│  - Request Validation                  │
│  - Rate Limiting (TODO)                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Service Layer                     │
│  - AIService                           │
│  - FileUploadService                   │
│  - EmailService                        │
│  - ResumeService (TODO)                │
│  - JobService (TODO)                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Data Access Layer                 │
│  - Drizzle ORM                         │
│  - Supabase Storage                    │
│  - Postgres Database                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      External Services                 │
│  - Resend (Email)                      │
│  - OpenAI (AI)                         │
│  - Supabase Auth                       │
│  - GitHub API                          │
│  - LinkedIn API (TODO)                 │
└─────────────────────────────────────────┘
```

---

## Implemented Components

### 1. Error Handling ✅

**Location:** `lib/errors/`

**Components:**
- `app-error.ts` - Custom error classes
- `error-handler.ts` - Centralized error middleware

**Features:**
- Standardized error responses
- Automatic error logging
- Request ID tracking
- Zod validation error handling

**Usage:**
```typescript
import { ValidationError, NotFoundError, apiErrorHandler } from '@/lib/errors'

// In route handlers
try {
  // Logic
} catch (error) {
  return apiErrorHandler(error, {
    route: '/api/users',
    method: 'POST'
  })
}
```

### 2. Validation ✅

**Location:** `lib/validation/schemas.ts`

**Features:**
- 40+ Zod validation schemas
- Type-safe request/response validation
- Consistent error messages
- Support for all major API endpoints

**Usage:**
```typescript
import { JobSearchSchema } from '@/lib/validation/schemas'

const validated = JobSearchSchema.parse(request.json())
// Type-safe: validated is JobSearchInput
```

### 3. Logging ✅

**Location:** `lib/logging/logger.ts`

**Features:**
- Structured logging
- Multiple log levels (DEBUG, INFO, WARN, ERROR)
- Performance metrics
- Request/response logging
- External service tracking

**Usage:**
```typescript
import { logger } from '@/lib/logging/logger'

logger.info('User created', { userId: user.id, email: user.email })
logger.error('Database error', error, { query: 'SELECT *' })
```

### 4. AI Service ✅

**Location:** `lib/services/ai.service.ts`

**Features:**
- Centralized LLM abstraction
- Multiple model support (GPT-4o, GPT-4o-mini, Claude, Gemini)
- Prompt templates for common tasks
- Streaming support
- Error handling with fallbacks
- Usage logging

**Available Methods:**
- `generate(prompt, options)` - Text completion
- `stream(prompt, options)` - Streaming responses
- `generateCoverLetter(data)`
- `analyzeResume(content, jobDescription)`
- `interviewPrep(data)`
- `analyzeSkillGap(data)`
- `careerCoach(question, context)`

**Usage:**
```typescript
import { aiService } from '@/lib/services/ai.service'

const coverLetter = await aiService.generateCoverLetter({
  jobTitle: 'Senior Engineer',
  company: 'Tech Corp',
  jobDescription: '...',
  userBackground: '...',
  tone: 'professional'
})
```

### 5. File Upload Service ✅

**Location:** `lib/services/file-upload.service.ts`

**Features:**
- PDF and DOCX support
- 10MB file size limit
- Automatic text extraction
- Supabase Storage integration
- Metadata saving to database
- Error handling

**Available Methods:**
- `validateFile(file)` - Pre-upload validation
- `uploadToStorage(file, userId)` - Upload to Supabase
- `extractText(file)` - Text extraction from PDF/DOCX
- `saveResumeMetadata(data)` - Save to database
- `uploadResume(file, userId, options)` - Complete upload workflow

**Usage:**
```typescript
import { fileUploadService } from '@/lib/services/file-upload.service'

const result = await fileUploadService.uploadResume(file, userId, {
  title: 'My Resume',
  extractText: true
})
```

### 6. Email Service ✅

**Location:** `lib/email/email-service.ts`

**Features:**
- Resend integration
- Multiple email templates
- Resume analysis notifications
- Job match notifications
- Weekly digest emails
- Generic notification support

**Usage:**
```typescript
import { emailService } from '@/lib/email/email-service'

await emailService.sendResumeAnalysis(email, {
  userName: 'John Doe',
  resumeName: 'Software Engineer Resume',
  overallScore: 85,
  topStrengths: [...],
  keyImprovements: [...],
  analysisUrl: 'https://...'
})
```

---

## Updated API Routes

### Resume Upload
**Route:** `POST /api/resume/upload`

**Changes:**
- Uses FileUploadService
- Validates with Zod schema
- Centralized error handling
- Automatic text extraction
- Request logging

**Request:**
```bash
curl -X POST http://localhost:3000/api/resume/upload \
  -F "file=@resume.pdf" \
  -F "title=My Resume"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "uuid",
      "title": "My Resume",
      "fileName": "resume.pdf",
      "fileUrl": "https://...",
      "fileSize": 245000,
      "uploadedAt": "2026-06-30T10:00:00Z"
    }
  }
}
```

---

## TO-DO: Services to Implement

### 1. Resume Service
**Location:** `lib/services/resume.service.ts`

**Methods Needed:**
- `listResumes(userId)` - Get all user resumes
- `getResume(resumeId)` - Get specific resume
- `updateResume(resumeId, data)` - Update resume
- `deleteResume(resumeId)` - Delete resume
- `setPrimaryResume(resumeId)` - Set as default
- `parseResumeContent(content)` - Extract structured data

### 2. Job Service
**Location:** `lib/services/job.service.ts`

**Methods Needed:**
- `searchJobs(params)` - Search with real data
- `recommendJobs(userId, params)` - Smart recommendations
- `saveJob(userId, jobId)` - Bookmark job
- `getSavedJobs(userId)` - Get bookmarks
- `trackApplication(userId, jobId, data)` - Track application
- `getApplications(userId)` - Get all applications

### 3. Notification Service
**Location:** `lib/services/notification.service.ts`

**Methods Needed:**
- `createNotification(userId, data)` - Create notification
- `listNotifications(userId)` - Get user notifications
- `markAsRead(notificationId)` - Mark read
- `updatePreferences(userId, prefs)` - Set preferences
- `getPreferences(userId)` - Get preferences
- `sendBrowserPush(userId, data)` - Push notification

### 4. Portfolio Service
**Location:** `lib/services/portfolio.service.ts`

**Methods Needed:**
- `analyzePortfolio(url)` - Analyze website
- `checkSEO(url)` - SEO score
- `checkAccessibility(url)` - A11y score
- `checkPerformance(url)` - Performance metrics
- `getRecommendations(url)` - Improvement suggestions

### 5. GitHub Service
**Location:** `lib/services/github.service.ts`

**Methods Needed:**
- `connectGitHub(code)` - OAuth flow
- `fetchRepositories(accessToken)` - Get repos
- `analyzeRepository(repo)` - Analyze repo quality
- `getContributions(username)` - Fetch contributions
- `calculateScore(repos)` - Overall score

### 6. LinkedIn Service
**Location:** `lib/services/linkedin.service.ts`

**Methods Needed:**
- `connectLinkedIn(code)` - OAuth flow
- `importProfile(accessToken)` - Import profile data
- `analyzeHeadline(headline)` - Analyze headline
- `analyzeAbout(about)` - Analyze about section
- `extractSkills(profile)` - Extract skills
- `getRecommendations(profile)` - Suggestions

---

## API Endpoints Status

### Authentication
- ✅ `/api/auth/[...all]` - Better Auth
- ✅ `/api/auth/github/callback` - GitHub OAuth
- ⚠️ `/api/auth/linkedin/callback` - LinkedIn OAuth (needs LinkedIn service)

### Resume
- ✅ `/api/resume/upload` - Upload resume (refactored)
- ⚠️ `/api/resume/analyze` - Analyze resume (needs enhancement)
- ❌ `/api/resumes/list` - List resumes (missing)
- ❌ `/api/resumes/:id` - Get resume (missing)
- ❌ `/api/resumes/:id/update` - Update resume (missing)
- ❌ `/api/resumes/:id/delete` - Delete resume (missing)

### Jobs
- ⚠️ `/api/jobs/search` - Search (mock data)
- ❌ `/api/jobs/recommendations` - Recommendations (missing)
- ❌ `/api/jobs/save` - Save job (missing)
- ❌ `/api/jobs/saved` - Saved jobs (missing)
- ❌ `/api/applications/track` - Track application (missing)

### AI
- ⚠️ `/api/ai/generate-cover-letter` - Cover letter (needs validation)
- ⚠️ `/api/ai/interview-prep` - Interview prep (needs validation)
- ⚠️ `/api/ai/salary-advisor` - Salary advice (needs validation)
- ⚠️ `/api/ai/skill-gap-analyzer` - Skill analysis (needs validation)
- ⚠️ `/api/career-coach/chat` - Career coach (needs validation)

### Developer Profiles
- ✅ `/api/github/analyze` - GitHub analysis (working)
- ⚠️ `/api/portfolio/analyze` - Portfolio (not implemented)
- ❌ `/api/linkedin/connect` - LinkedIn auth (missing)

### Notifications
- ❌ `/api/notifications/list` - List notifications (missing)
- ❌ `/api/notifications/preferences` - Preferences (missing)
- ⚠️ `/api/cron/resume-reminders` - Email reminders (basic)
- ⚠️ `/api/cron/weekly-digest` - Weekly digest (basic)

### Admin
- ⚠️ `/api/admin/stats` - Stats (needs auth check)
- ⚠️ `/api/admin/users` - User list (needs auth check)

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Database
DATABASE_URL=postgresql://user:password@host/db

# AI
OPENAI_API_KEY=sk-xxx

# Email
RESEND_API_KEY=re_xxx

# OAuth (TODO)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=https://careerpilot.com
NODE_ENV=production
```

---

## Security Checklist

- [x] Input validation with Zod
- [x] Authentication check in routes
- [x] Error sanitization
- [ ] Rate limiting middleware
- [ ] CORS configuration
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers
- [ ] API key rotation
- [ ] Request size limits
- [ ] Timeout configurations

---

## Performance Optimization

- [ ] Database query indexing
- [ ] Response caching
- [ ] Lazy loading
- [ ] Pagination implementation
- [ ] Batch operations
- [ ] Connection pooling
- [ ] CDN for assets
- [ ] Image optimization

---

## Monitoring & Logging

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] API metrics dashboard
- [ ] Alert setup
- [ ] Log aggregation
- [ ] Database monitoring

---

## Testing

- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] E2E tests for workflows
- [ ] Load testing
- [ ] Security testing

---

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run
- [ ] Storage buckets configured
- [ ] Domain configured
- [ ] SSL/TLS enabled
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error tracking enabled
- [ ] API documentation deployed
- [ ] Health check endpoint

---

## Next Steps

1. **Immediate (This Sprint)**
   - [ ] Implement missing services
   - [ ] Add rate limiting
   - [ ] Setup error tracking
   - [ ] Complete API validation

2. **Short Term (Next Sprint)**
   - [ ] Implement missing endpoints
   - [ ] Add comprehensive tests
   - [ ] Setup monitoring
   - [ ] Performance optimization

3. **Medium Term (2-3 Sprints)**
   - [ ] LinkedIn integration
   - [ ] Real job data sources
   - [ ] Advanced recommendations
   - [ ] Browser notifications

4. **Long Term (4+ Sprints)**
   - [ ] Mobile app
   - [ ] Advanced analytics
   - [ ] AI coaching improvements
   - [ ] B2B features

---

## References

- Validation: `lib/validation/schemas.ts`
- Error Handling: `lib/errors/`
- Logging: `lib/logging/logger.ts`
- Services: `lib/services/`
- API Routes: `app/api/`
- Database: `lib/db/schema.ts`

