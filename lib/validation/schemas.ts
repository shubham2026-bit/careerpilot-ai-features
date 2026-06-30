import { z } from 'zod'

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// ============================================================================
// RESUME SCHEMAS
// ============================================================================

export const ResumeUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').optional().default('My Resume'),
  fileName: z.string(),
  fileSize: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  fileType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']),
})

export const ResumeAnalysisRequestSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  jobDescription: z.string().optional(),
})

export const ResumUpdateSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  title: z.string().optional(),
  content: z.string().optional(),
  isPrimary: z.boolean().optional(),
})

export const ResumeDeleteSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
})

// ============================================================================
// JOB SEARCH SCHEMAS
// ============================================================================

export const JobSearchSchema = z.object({
  title: z.string().optional().default('Software Engineer'),
  location: z.string().optional().default('Remote'),
  experience: z.enum(['entry', 'mid', 'senior']).optional().default('mid'),
  jobType: z.enum(['fulltime', 'contract', 'remote']).optional().default('fulltime'),
  limit: z.number().min(1).max(50).optional().default(10),
  page: z.number().min(1).optional().default(1),
})

export const JobSaveSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
})

export const JobApplicationSchema = z.object({
  jobId: z.string(),
  resumeId: z.string().uuid(),
  coverLetterId: z.string().uuid().optional(),
  applicationDate: z.date().optional(),
  status: z.enum(['applied', 'rejected', 'interview', 'offer', 'accepted']).optional(),
})

// ============================================================================
// AI GENERATION SCHEMAS
// ============================================================================

export const CoverLetterGenerationSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  jobDescription: z.string().min(10, 'Job description must be at least 10 characters'),
  userBackground: z.string().min(10, 'User background must be at least 10 characters'),
  tone: z.enum(['professional', 'creative', 'friendly']).optional().default('professional'),
})

export const InterviewPrepSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().optional(),
  experience: z.enum(['entry', 'mid', 'senior']).optional(),
})

export const SkillGapAnalysisSchema = z.object({
  currentSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  targetRole: z.string().min(1, 'Target role is required'),
  experience: z.enum(['entry', 'mid', 'senior']).optional(),
})

export const SalaryAdvisorSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  experience: z.enum(['entry', 'mid', 'senior']).optional(),
  skills: z.array(z.string()).optional(),
})

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export const GitHubAnalysisSchema = z.object({
  username: z.string().min(1, 'GitHub username is required'),
})

export const PortfolioAnalysisSchema = z.object({
  portfolioUrl: z.string().url('Invalid portfolio URL'),
})

export const LinkedInImportSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
})

// ============================================================================
// NOTIFICATION SCHEMAS
// ============================================================================

export const NotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional().default(true),
  resumeReminders: z.boolean().optional().default(true),
  jobMatches: z.boolean().optional().default(true),
  weeklyDigest: z.boolean().optional().default(true),
  pushNotifications: z.boolean().optional().default(false),
  notificationFrequency: z.enum(['immediate', 'daily', 'weekly']).optional().default('daily'),
})

export const EmailNotificationSchema = z.object({
  recipientEmail: z.string().email(),
  subject: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  actionUrl: z.string().url().optional(),
  actionLabel: z.string().optional(),
})

// ============================================================================
// CAREER COACHING SCHEMAS
// ============================================================================

export const CareerCoachChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  conversationId: z.string().uuid().optional(),
  context: z.record(z.any()).optional(),
})

export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  sessionId: z.string().uuid().optional(),
})

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

export const AdminStatsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export const UserListQuerySchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
  sortBy: z.enum(['createdAt', 'name', 'email']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Export types
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type ResumeUploadInput = z.infer<typeof ResumeUploadSchema>
export type JobSearchInput = z.infer<typeof JobSearchSchema>
export type CoverLetterGenerationInput = z.infer<typeof CoverLetterGenerationSchema>
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>
export type CareerCoachChatInput = z.infer<typeof CareerCoachChatSchema>
