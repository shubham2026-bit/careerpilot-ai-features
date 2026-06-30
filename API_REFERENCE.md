# CareerPilot AI - API Reference Guide

**Version:** 1.0  
**Base URL:** `https://careerpilot.com/api` (production) or `http://localhost:3000/api` (development)  
**Authentication:** Bearer token (Better Auth)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Resume Management](#resume-management)
3. [Job Search & Management](#job-search--management)
4. [AI Services](#ai-services)
5. [Developer Profiles](#developer-profiles)
6. [Notifications](#notifications)
7. [Error Handling](#error-handling)
8. [Response Format](#response-format)

---

## Authentication

All endpoints require authentication unless specified otherwise.

### Headers
```bash
Authorization: Bearer {token}
Content-Type: application/json
```

### Auth Endpoints

#### Login
**POST** `/auth/login`

```bash
curl -X POST /auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

#### Register
**POST** `/auth/register`

```bash
curl -X POST /auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "secure_password"
  }'
```

---

## Resume Management

### Upload Resume
**POST** `/resume/upload`

**Required Fields:**
- `file` (FormData) - PDF or DOCX file, max 10MB
- `title` (optional) - Resume title

**Example:**
```bash
curl -X POST /resume/upload \
  -H "Authorization: Bearer token" \
  -F "file=@resume.pdf" \
  -F "title=Senior Engineer Resume"
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Senior Engineer Resume",
      "fileName": "resume.pdf",
      "fileUrl": "https://xxx.supabase.co/storage/...",
      "fileSize": 245812,
      "uploadedAt": "2026-06-30T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- **400** - Invalid file format or size
- **401** - Not authenticated
- **413** - File too large

---

### Analyze Resume
**POST** `/resume/analyze`

**Request Body:**
```json
{
  "resumeId": "550e8400-e29b-41d4-a716-446655440000",
  "jobDescription": "Optional job description for targeted analysis"
}
```

**Example:**
```bash
curl -X POST /resume/analyze \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "550e8400...",
    "jobDescription": "Senior Software Engineer..."
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "overallScore": 85,
      "strengths": [
        "Strong technical background",
        "Clear career progression",
        "Quantifiable achievements"
      ],
      "improvements": [
        "Add more specific metrics",
        "Expand skills section",
        "Include certifications"
      ],
      "missingKeywords": ["Cloud", "DevOps", "Kubernetes"],
      "recommendations": [
        "Reorganize experience section",
        "Add metrics to achievements",
        "Include technical skills"
      ],
      "formattingScore": 90,
      "contentScore": 80,
      "impactScore": 85
    }
  }
}
```

---

### List Resumes
**GET** `/resumes/list` (TODO)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `sortBy` (optional) - `createdAt`, `title`, `fileSize`
- `sortOrder` (optional) - `asc`, `desc`

**Example:**
```bash
curl -X GET "/resumes/list?page=1&limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer token"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Senior Engineer Resume",
      "fileName": "resume.pdf",
      "fileSize": 245812,
      "uploadedAt": "2026-06-30T10:30:00Z",
      "isPrimary": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### Delete Resume
**DELETE** `/resumes/:id` (TODO)

**Example:**
```bash
curl -X DELETE /resumes/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer token"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Resume deleted successfully"
  }
}
```

---

## Job Search & Management

### Search Jobs
**POST** `/jobs/search`

**Request Body:**
```json
{
  "title": "Software Engineer",
  "location": "Remote",
  "experience": "mid",
  "jobType": "fulltime",
  "limit": 20,
  "page": 1
}
```

**Example:**
```bash
curl -X POST /jobs/search \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "location": "San Francisco, CA",
    "experience": "mid"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "job_123",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salaryMin": 150000,
      "salaryMax": 200000,
      "jobType": "fulltime",
      "description": "We're looking for...",
      "requirements": ["JavaScript", "React", "Node.js"],
      "niceToHaves": ["TypeScript", "AWS"],
      "postedDate": "2026-06-28T00:00:00Z",
      "url": "https://example.com/jobs/123"
    }
  ],
  "pagination": {
    "total": 245,
    "page": 1,
    "limit": 20
  }
}
```

---

### Get Job Recommendations
**POST** `/jobs/recommendations` (TODO)

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": "mid",
  "preferences": "Remote, SaaS companies"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "jobId": "job_123",
        "title": "Senior React Developer",
        "company": "TechCorp",
        "matchScore": 92,
        "reason": "Strong skills match and remote opportunity",
        "matchedSkills": ["JavaScript", "React"],
        "missingSkills": ["TypeScript"]
      }
    ]
  }
}
```

---

### Save Job
**POST** `/jobs/save` (TODO)

**Request Body:**
```json
{
  "jobId": "job_123",
  "jobTitle": "Senior Engineer",
  "company": "Tech Corp"
}
```

---

### Get Saved Jobs
**GET** `/jobs/saved` (TODO)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

---

## AI Services

### Generate Cover Letter
**POST** `/ai/generate-cover-letter`

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "company": "Google",
  "jobDescription": "We're looking for a senior engineer to...",
  "userBackground": "I have 8 years of experience in...",
  "tone": "professional"
}
```

**Example:**
```bash
curl -X POST /ai/generate-cover-letter \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Senior Software Engineer",
    "company": "Google",
    "jobDescription": "...",
    "userBackground": "...",
    "tone": "professional"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "coverLetter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Software Engineer position at Google...",
    "generatedAt": "2026-06-30T11:00:00Z"
  }
}
```

---

### Interview Preparation
**POST** `/ai/interview-prep`

**Request Body:**
```json
{
  "jobTitle": "Senior Engineer",
  "company": "Tech Corp",
  "role": "Backend Lead",
  "experience": "mid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "preparation": {
      "technicalQuestions": [
        "Explain your approach to system design",
        "How would you handle database optimization?"
      ],
      "behavioralQuestions": [
        "Tell us about a time you led a difficult project",
        "How do you handle disagreement with team members?"
      ],
      "companyCulture": "Tech Corp values innovation and collaboration...",
      "keyTopics": ["Microservices", "Cloud Architecture", "Team Leadership"],
      "tips": [
        "Prepare specific examples from your experience",
        "Research the company thoroughly",
        "Ask thoughtful questions"
      ],
      "estimatedSalaryRange": "$150,000 - $200,000"
    }
  }
}
```

---

### Skill Gap Analysis
**POST** `/ai/skill-gap-analyzer`

**Request Body:**
```json
{
  "currentSkills": ["JavaScript", "React", "Node.js"],
  "targetRole": "Full Stack Architect",
  "experience": "mid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "gapAnalysis": [
        "Lack of system design experience",
        "Limited DevOps knowledge",
        "No cloud architecture experience"
      ],
      "recommendedSkills": [
        "Kubernetes",
        "Terraform",
        "AWS/GCP",
        "System Design"
      ],
      "learningPath": [
        "Start with Docker and container basics",
        "Progress to Kubernetes orchestration",
        "Learn infrastructure as code",
        "Study system design patterns"
      ],
      "estimatedTimeToMaster": "6-12 months",
      "resources": [
        "Kubernetes documentation",
        "Terraform guides",
        "System Design Primer book"
      ],
      "priorityLevel": "high"
    }
  }
}
```

---

### Career Coaching Chat
**POST** `/career-coach/chat`

**Request Body:**
```json
{
  "message": "How do I transition from frontend to full stack?",
  "conversationId": "conv_123" (optional),
  "context": "I have 5 years of React experience" (optional)
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "response": "Great question! Here's my advice for transitioning from frontend to full stack...",
    "conversationId": "conv_123",
    "followUpSuggestions": [
      "What backend languages interest you?",
      "Tell me about your current tech stack"
    ]
  }
}
```

---

## Developer Profiles

### Analyze GitHub Profile
**POST** `/github/analyze`

**Request Body:**
```json
{
  "username": "octocat"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "overallRating": 82,
      "strengths": [
        "Active contributions",
        "Diverse project portfolio",
        "Good code documentation"
      ],
      "projectQuality": 85,
      "codeConsistency": 80,
      "projectDiversity": 90,
      "topSkills": ["Python", "JavaScript", "Go"],
      "recommendations": [
        "Increase contribution frequency",
        "Add more documentation to projects",
        "Create a signature project"
      ],
      "careerFit": {
        "roles": ["Full Stack Developer", "Backend Engineer"],
        "industries": ["SaaS", "FinTech"]
      }
    }
  }
}
```

---

### Analyze Portfolio
**POST** `/portfolio/analyze` (TODO)

**Request Body:**
```json
{
  "portfolioUrl": "https://johndoe.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "seoScore": 85,
      "accessibilityScore": 78,
      "performanceScore": 82,
      "recommendations": [
        "Add meta tags to improve SEO",
        "Improve color contrast for accessibility",
        "Optimize images for performance"
      ]
    }
  }
}
```

---

## Notifications

### Get Notifications
**GET** `/notifications/list` (TODO)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `read` (optional) - `true`, `false`, or `all`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "resume_analysis",
      "title": "Your resume analysis is ready",
      "message": "Your Senior Engineer resume scored 85/100",
      "read": false,
      "createdAt": "2026-06-30T10:00:00Z",
      "actionUrl": "/dashboard/resume/550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

---

### Update Notification Preferences
**POST** `/notifications/preferences` (TODO)

**Request Body:**
```json
{
  "emailNotifications": true,
  "resumeReminders": true,
  "jobMatches": true,
  "weeklyDigest": true,
  "pushNotifications": false,
  "notificationFrequency": "daily"
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "requestId": "req_xxx",
  "details": {} (optional)
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Resume uploaded successfully |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resume not found |
| 409 | Conflict | Duplicate resource |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |
| 502 | Bad Gateway | External service error |

### Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_ERROR` | 401 | Not authenticated |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND_ERROR` | 404 | Resource not found |
| `CONFLICT_ERROR` | 409 | Duplicate/conflict |
| `RATE_LIMIT_ERROR` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service down |

### Example Error Response

```json
{
  "error": "File size exceeds 10MB limit",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "requestId": "req_1719735000123_abc1234",
  "details": {
    "errors": [
      {
        "path": "file.size",
        "message": "File size must not exceed 10MB",
        "code": "too_large"
      }
    ]
  }
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "requestId": "req_xxx" (optional)
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Items array
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "requestId": "req_xxx"
}
```

---

## Rate Limiting (Coming Soon)

Rate limits will be implemented per-user:
- **Standard:** 100 requests/minute
- **AI Generation:** 10 requests/minute
- **File Upload:** 5 uploads/minute

Response headers include:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Webhooks (Coming Soon)

Subscribe to events:
- `resume.analyzed`
- `job.matched`
- `interview.scheduled`
- `application.updated`

---

## SDK & Libraries

### JavaScript/TypeScript
```typescript
import { CareerPilotAPI } from '@careerpilot/api-sdk'

const api = new CareerPilotAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://careerpilot.com/api'
})

// Usage
const resume = await api.resume.upload(file)
const analysis = await api.resume.analyze(resumeId)
```

---

## Support

For API questions or issues:
- Email: `api-support@careerpilot.com`
- Documentation: `https://docs.careerpilot.com`
- GitHub Issues: `https://github.com/careerpilot/api`
- Status Page: `https://status.careerpilot.com`

---

**Last Updated:** June 30, 2026  
**Version:** 1.0.0

