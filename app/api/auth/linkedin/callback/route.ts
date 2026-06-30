import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { linkedinProfiles } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_OAUTH_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_OAUTH_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/linkedin/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('[v0] LinkedIn OAuth error:', tokenData.error)
      return NextResponse.redirect(new URL('/login?error=linkedin_auth_failed', request.url))
    }

    const accessToken = tokenData.access_token

    // Get user profile from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    const linkedinUser = await profileResponse.json()

    if (!linkedinUser.id) {
      return NextResponse.redirect(new URL('/login?error=linkedin_user_failed', request.url))
    }

    // Get authenticated user from Supabase
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url))
    }

    // Check if LinkedIn profile exists
    const [existingProfile] = await db
      .select()
      .from(linkedinProfiles)
      .where(eq(linkedinProfiles.user_id, user.id))
      .limit(1)

    // Get profile picture
    const pictureResponse = await fetch(
      'https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage))',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    let profilePicture = null
    if (pictureResponse.ok) {
      const pictureData = await pictureResponse.json()
      profilePicture = pictureData.profilePicture?.displayImage
    }

    if (existingProfile) {
      // Update existing profile
      await db
        .update(linkedinProfiles)
        .set({
          linkedin_id: linkedinUser.id,
          profile_url: `https://www.linkedin.com/in/${linkedinUser.id}`,
          profile_picture: profilePicture,
          access_token: accessToken,
          last_synced: new Date(),
          updated_at: new Date(),
        })
        .where(eq(linkedinProfiles.user_id, user.id))
    } else {
      // Create new profile
      await db.insert(linkedinProfiles).values({
        id: uuidv4(),
        user_id: user.id,
        linkedin_id: linkedinUser.id,
        profile_url: `https://www.linkedin.com/in/${linkedinUser.id}`,
        profile_picture: profilePicture,
        access_token: accessToken,
        last_synced: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    // Redirect back to dashboard
    return NextResponse.redirect(new URL('/dashboard/linkedin?connected=true', request.url))
  } catch (error) {
    console.error('[v0] LinkedIn OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}
