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
