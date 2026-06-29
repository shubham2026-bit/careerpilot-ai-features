import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
export const resumes = pgTable('resumes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  fileName: text('fileName').notNull(),
  fileUrl: text('fileUrl').notNull(),
  rawText: text('rawText').notNull(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  summary: text('summary'),
  skills: jsonb('skills').$type<string[]>().default([]),
  experience: jsonb('experience').$type<any[]>().default([]),
  education: jsonb('education').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const resumeAnalysis = pgTable('resumeAnalysis', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  resumeId: text('resumeId').notNull(),
  overallScore: numeric('overallScore', { precision: 5, scale: 2 }).notNull(),
  skillsScore: numeric('skillsScore', { precision: 5, scale: 2 }).notNull(),
  experienceScore: numeric('experienceScore', { precision: 5, scale: 2 }).notNull(),
  educationScore: numeric('educationScore', { precision: 5, scale: 2 }).notNull(),
  formattingScore: numeric('formattingScore', { precision: 5, scale: 2 }).notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  recommendations: jsonb('recommendations').$type<any[]>().default([]),
  keywordMissing: jsonb('keywordMissing').$type<string[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const linkedinProfiles = pgTable('linkedinProfiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  profileUrl: text('profileUrl').notNull(),
  fullName: text('fullName'),
  headline: text('headline'),
  location: text('location'),
  about: text('about'),
  profileImageUrl: text('profileImageUrl'),
  connections: integer('connections').default(0),
  endorsements: integer('endorsements').default(0),
  skills: jsonb('skills').$type<any[]>().default([]),
  experience: jsonb('experience').$type<any[]>().default([]),
  education: jsonb('education').$type<any[]>().default([]),
  certifications: jsonb('certifications').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const linkedinAnalysis = pgTable('linkedinAnalysis', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  profileId: text('profileId').notNull(),
  overallScore: numeric('overallScore', { precision: 5, scale: 2 }).notNull(),
  completenessScore: numeric('completenessScore', { precision: 5, scale: 2 }).notNull(),
  visibilityScore: numeric('visibilityScore', { precision: 5, scale: 2 }).notNull(),
  engagementScore: numeric('engagementScore', { precision: 5, scale: 2 }).notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  recommendations: jsonb('recommendations').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const githubProfiles = pgTable('githubProfiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  username: text('username').notNull().unique(),
  profileUrl: text('profileUrl').notNull(),
  name: text('name'),
  bio: text('bio'),
  avatarUrl: text('avatarUrl'),
  publicRepos: integer('publicRepos').default(0),
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  totalStars: integer('totalStars').default(0),
  topLanguages: jsonb('topLanguages').$type<string[]>().default([]),
  recentProjects: jsonb('recentProjects').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const githubAnalysis = pgTable('githubAnalysis', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  profileId: text('profileId').notNull(),
  overallScore: numeric('overallScore', { precision: 5, scale: 2 }).notNull(),
  codeQualityScore: numeric('codeQualityScore', { precision: 5, scale: 2 }).notNull(),
  activityScore: numeric('activityScore', { precision: 5, scale: 2 }).notNull(),
  diversityScore: numeric('diversityScore', { precision: 5, scale: 2 }).notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  recommendations: jsonb('recommendations').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const portfolioProjects = pgTable('portfolioProjects', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  imageUrl: text('imageUrl'),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  role: text('role'),
  impact: text('impact'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const portfolioAnalysis = pgTable('portfolioAnalysis', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  overallScore: numeric('overallScore', { precision: 5, scale: 2 }).notNull(),
  presentationScore: numeric('presentationScore', { precision: 5, scale: 2 }).notNull(),
  diversityScore: numeric('diversityScore', { precision: 5, scale: 2 }).notNull(),
  impactScore: numeric('impactScore', { precision: 5, scale: 2 }).notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  recommendations: jsonb('recommendations').$type<any[]>().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
