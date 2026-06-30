import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.LINKEDIN_OAUTH_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`
    const state = uuidv4() // Generate a random state for CSRF protection
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'LinkedIn OAuth client ID not configured' },
        { status: 500 }
      )
    }

    // Redirect to LinkedIn OAuth authorization endpoint
    const linkedinAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
    linkedinAuthUrl.searchParams.append('response_type', 'code')
    linkedinAuthUrl.searchParams.append('client_id', clientId)
    linkedinAuthUrl.searchParams.append('redirect_uri', redirectUri)
    linkedinAuthUrl.searchParams.append('scope', 'openid profile email')
    linkedinAuthUrl.searchParams.append('state', state)

    return NextResponse.redirect(linkedinAuthUrl.toString())
  } catch (error) {
    console.error('[v0] LinkedIn OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'OAuth initiation failed' },
      { status: 500 }
    )
  }
}
