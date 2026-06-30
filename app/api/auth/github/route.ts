import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
    const state = uuidv4() // Generate a random state for CSRF protection
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'GitHub OAuth client ID not configured' },
        { status: 500 }
      )
    }

    // Redirect to GitHub OAuth authorization endpoint
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
    githubAuthUrl.searchParams.append('client_id', clientId)
    githubAuthUrl.searchParams.append('redirect_uri', redirectUri)
    githubAuthUrl.searchParams.append('scope', 'user:email read:user')
    githubAuthUrl.searchParams.append('state', state)

    return NextResponse.redirect(githubAuthUrl.toString())
  } catch (error) {
    console.error('[v0] GitHub OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'OAuth initiation failed' },
      { status: 500 }
    )
  }
}
