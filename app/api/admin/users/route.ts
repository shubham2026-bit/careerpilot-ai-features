import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { verifyAdminAccess } from '@/lib/auth/admin'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    // CRITICAL: Verify admin access before proceeding
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const supabase = await createServerSupabase()

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // List all users
    const { data: allUsers, error } = await supabase.auth.admin.listUsers({
      perPage: limit,
      page,
    })

    if (error || !allUsers) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      users: allUsers.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        user_metadata: u.user_metadata,
      })),
      pagination: {
        page,
        limit,
        total: allUsers.users.length,
      },
    })
  } catch (error) {
    console.error('[v0] Admin users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
