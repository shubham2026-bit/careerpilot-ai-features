import { createServerSupabase } from '@/lib/supabase/server'

// Admin emails list - move to database in production
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

/**
 * Verify if current user is an admin
 * In production, this should check an is_admin flag in the database
 */
export async function verifyAdminAccess(): Promise<boolean> {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return false
    }

    // Check if user email is in admin list
    if (ADMIN_EMAILS.includes(user.email || '')) {
      return true
    }

    // TODO: In production, add is_admin field to user table for scalability
    // const { data: userData } = await supabase
    //   .from('user')
    //   .select('is_admin')
    //   .eq('id', user.id)
    //   .single()
    // return userData?.is_admin || false

    return false
  } catch (error) {
    console.error('[v0] Admin verification error:', error)
    return false
  }
}

/**
 * Verify admin access and throw if not authorized
 */
export async function requireAdminAccess(): Promise<void> {
  const isAdmin = await verifyAdminAccess()
  if (!isAdmin) {
    throw new Error('Admin access required')
  }
}
