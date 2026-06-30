import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { userAnalytics } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 60

const systemPrompt = `You are CareerPilot, an expert career coach and AI advisor. You have deep knowledge in:
- Resume writing and optimization
- LinkedIn profile enhancement
- Interview preparation
- Salary negotiation
- Career transitions
- Skill development
- Job search strategies
- Professional branding
- Networking and relationship building
- Work-life balance and career satisfaction

Your role is to provide personalized, actionable advice to help professionals advance their careers. Be empathetic, encouraging, and practical. Ask clarifying questions when needed. Provide specific, measurable recommendations.

Remember:
- The user may be at any career stage (entry-level to executive)
- Consider industry, location, and personal goals
- Be culturally aware and inclusive
- Focus on sustainable, long-term career growth
- When discussing sensitive topics (layoffs, job loss, etc.), be compassionate`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Track AI usage
    await db.insert(userAnalytics).values({
      id: uuidv4(),
      user_id: user.id,
      event_type: 'career_coach_chat',
      event_data: {
        messageCount: messages.length,
      },
      created_at: new Date(),
    }).catch((error) => {
      console.error('[v0] Failed to track analytics:', error)
    })

    // Stream the response
    const result = await streamText({
      model: 'gpt-4o-mini',
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Return the stream as a Response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[v0] Career coach error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
