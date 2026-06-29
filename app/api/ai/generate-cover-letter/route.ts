import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { userAnalytics } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      jobTitle,
      company,
      jobDescription,
      userBackground,
      tone = 'professional',
    } = await request.json()

    if (!jobTitle || !company || !jobDescription || !userBackground) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prompt = `Write a compelling cover letter for the following position:

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE BACKGROUND:
${userBackground}

TONE: ${tone}

Generate a professional cover letter that:
1. Opens with a strong hook specific to the company and role
2. Highlights relevant skills and experiences from the job description
3. Shows genuine interest in the company and role
4. Includes specific achievements and quantifiable results
5. Closes with a call to action
6. Is 3-4 paragraphs long
7. Has a professional tone but with personality

Format it as a complete cover letter ready to send. Include placeholders for [Your Name], [Date], [Hiring Manager Name], etc.`

    const { text: coverLetter } = await generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.8,
      maxTokens: 1024,
    })

    // Track usage
    await db.insert(userAnalytics).values({
      id: uuidv4(),
      user_id: user.id,
      event_type: 'cover_letter_generated',
      event_data: {
        jobTitle,
        company,
      },
      created_at: new Date(),
    }).catch((error) => {
      console.error('[v0] Failed to track analytics:', error)
    })

    return NextResponse.json({
      success: true,
      coverLetter,
      generated_at: new Date(),
    })
  } catch (error) {
    console.error('[v0] Cover letter generation error:', error)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}
