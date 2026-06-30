'use server'

import { db } from '@/lib/db'
import { userAnalytics } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserId } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function getUserAnalytics() {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(userAnalytics)
    .where(eq(userAnalytics.userId, userId))
  
  return result[0] || null
}

export async function initializeUserAnalytics() {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(userAnalytics)
    .where(eq(userAnalytics.userId, userId))
  
  if (existing.length > 0) return existing[0]
  
  return db
    .insert(userAnalytics)
    .values({
      id: uuidv4(),
      userId,
      totalResumeUploads: 0,
      totalProfileViews: 0,
      averageResumeScore: '0',
      careerGrowthScore: '0',
      jobMatchPercentage: '0',
      skillGaps: JSON.stringify([]),
      topSkills: JSON.stringify([]),
      activityLog: [],
    })
    .returning()
    .then((r) => r[0])
}

export async function updateAnalytics(data: Partial<{
  totalResumeUploads: number
  totalProfileViews: number
  averageResumeScore: number
  careerGrowthScore: number
  jobMatchPercentage: number
  skillGaps: string[]
  topSkills: string[]
}>) {
  const userId = await getUserId()
  return db
    .update(userAnalytics)
    .set({
      ...data,
      lastUpdated: new Date(),
    })
    .where(eq(userAnalytics.userId, userId))
    .returning()
    .then((r) => r[0])
}

export async function logActivity(activity: {
  type: string
  description: string
  timestamp: Date
}) {
  const userId = await getUserId()
  const analytics = await getUserAnalytics()
  
  if (!analytics) {
    await initializeUserAnalytics()
  }
  
  const currentLog = analytics?.activityLog || []
  const newLog = [...currentLog, activity].slice(-50) // Keep last 50
  
  return db
    .update(userAnalytics)
    .set({
      activityLog: newLog,
      lastUpdated: new Date(),
    })
    .where(eq(userAnalytics.userId, userId))
    .returning()
    .then((r) => r[0])
}
