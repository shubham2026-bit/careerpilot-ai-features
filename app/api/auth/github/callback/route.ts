import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { githubProfiles } from '@/lib/db/schema'
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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        state,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('[v0] GitHub OAuth error:', tokenData.error)
      return NextResponse.redirect(new URL('/login?error=github_auth_failed', request.url))
    }

    const accessToken = tokenData.access_token

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const githubUser = await userResponse.json()

    if (!githubUser.id) {
      return NextResponse.redirect(new URL('/login?error=github_user_failed', request.url))
    }

    // Get authenticated user from Supabase
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url))
    }

    // Check if GitHub profile exists
    const [existingProfile] = await db
      .select()
      .from(githubProfiles)
      .where(eq(githubProfiles.userId, user.id))
      .limit(1)

    if (existingProfile) {
      // Update existing profile
      await db
        .update(githubProfiles)
        .set({
          username: githubUser.login,
          profileUrl: githubUser.html_url,
          avatarUrl: githubUser.avatar_url,
          bio: githubUser.bio,
          publicRepos: githubUser.public_repos,
          followers: githubUser.followers,
          following: githubUser.following,
          updatedAt: new Date(),
        })
        .where(eq(githubProfiles.userId, user.id))
    } else {
      // Create new profile
      await db.insert(githubProfiles).values({
        id: uuidv4(),
        userId: user.id,
        username: githubUser.login,
        profileUrl: githubUser.html_url,
        name: githubUser.name,
        bio: githubUser.bio || '',
        avatarUrl: githubUser.avatar_url,
        publicRepos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
        topLanguages: [],
        recentProjects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Redirect back to dashboard
    return NextResponse.redirect(new URL('/dashboard/github?connected=true', request.url))
  } catch (error) {
    console.error('[v0] GitHub OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}
