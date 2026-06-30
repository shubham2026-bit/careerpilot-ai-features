'use server'

import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getUserId } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function getNotifications() {
  const userId = await getUserId()
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
}

export async function getUnreadNotificationCount() {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
  return result.filter((n) => !n.read).length
}

export async function markNotificationAsRead(notificationId: string) {
  const userId = await getUserId()
  return db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId))
}

export async function markAllAsRead() {
  const userId = await getUserId()
  return db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, userId))
}

export async function deleteNotification(notificationId: string) {
  await markNotificationAsRead(notificationId)
  return db
    .delete(notifications)
    .where(eq(notifications.id, notificationId))
}

export async function createNotification(data: {
  type: string
  title: string
  message: string
  icon?: string
  color?: string
  actionUrl?: string
  actionLabel?: string
  metadata?: any
}) {
  const userId = await getUserId()
  return db
    .insert(notifications)
    .values({
      id: uuidv4(),
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      icon: data.icon,
      color: data.color,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      metadata: data.metadata || {},
    })
    .returning()
}
