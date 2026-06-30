'use server'

import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserId } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function getUserSettings() {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
  
  return result[0] || null
}

export async function initializeUserSettings() {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
  
  if (existing.length > 0) return existing[0]
  
  return db
    .insert(userSettings)
    .values({
      id: uuidv4(),
      userId,
      emailNotifications: true,
      careerTips: true,
      jobAlerts: true,
      weeklyDigest: false,
      theme: 'dark',
      language: 'en',
      privateProfile: true,
      dataCollection: true,
    })
    .returning()
    .then((r) => r[0])
}

export async function updateUserSettings(data: Partial<{
  emailNotifications: boolean
  careerTips: boolean
  jobAlerts: boolean
  weeklyDigest: boolean
  theme: string
  language: string
  privateProfile: boolean
  dataCollection: boolean
}>) {
  const userId = await getUserId()
  
  const existing = await getUserSettings()
  if (!existing) {
    await initializeUserSettings()
  }
  
  return db
    .update(userSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId))
    .returning()
    .then((r) => r[0])
}
