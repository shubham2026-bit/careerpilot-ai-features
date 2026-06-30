import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const careerCoachSystem = `You are an expert AI Career Coach with decades of experience in career development, executive coaching, and industry insights. Your role is to provide personalized, actionable career advice to help professionals advance their careers.

Key Principles:
- Be empathetic, encouraging, and professional
- Provide specific, actionable advice tailored to the user's situation
- Ask clarifying questions to better understand their goals and challenges
- Offer data-driven insights and industry trends
- Help with resume optimization, interview preparation, salary negotiation, and career transitions
- Suggest concrete next steps and action items
- Share relevant resources, tools, and strategies
- Maintain confidentiality and be respectful of all backgrounds

When giving advice:
1. Listen carefully to understand their situation
2. Acknowledge their concerns and validate their feelings
3. Provide thoughtful, research-backed recommendations
4. Offer multiple perspectives when appropriate
5. Empower them to make informed decisions
6. Follow up with practical implementation strategies`

    const result = streamText({
      model: 'openai/gpt-4o-mini', // FIXED: Use correct model name
      system: careerCoachSystem,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: allMessages, isAborted }) => {
        if (isAborted) return
        // Could save chat history to database here
      },
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
