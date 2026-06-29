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
      industryType,
      experienceLevel,
      focusAreas = [],
    } = await request.json()

    if (!jobTitle || !company) {
      return NextResponse.json(
        { error: 'Job title and company are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert interview coach. Generate comprehensive interview preparation materials for this position:

JOB TITLE: ${jobTitle}
COMPANY: ${company}
INDUSTRY: ${industryType || 'Technology'}
EXPERIENCE LEVEL: ${experienceLevel || 'Mid-level'}
FOCUS AREAS: ${focusAreas.length > 0 ? focusAreas.join(', ') : 'General'}

Generate interview prep content in JSON format:
{
  "commonQuestions": [
    {
      "question": "<question>",
      "tips": ["<tip1>", "<tip2>"],
      "sampleAnswer": "<strong answer example>"
    }
  ],
  "companySpecificQuestions": [
    {
      "question": "<company-specific question>",
      "whatTheyWantToKnow": "<what the interviewer is looking for>",
      "sampleAnswer": "<answer>"
    }
  ],
  "technicalTopics": [
    {
      "topic": "<topic>",
      "keyPoints": ["<point1>", "<point2>"],
      "sampleProblems": ["<problem1>"]
    }
  ],
  "companyResearch": {
    "recentNews": ["<news1>", "<news2>"],
    "competitorAnalysis": "<analysis>",
    "culturalValues": ["<value1>", "<value2>"]
  },
  "interviewTips": [
    "<tip1>",
    "<tip2>",
    "<tip3>"
  ],
  "questionsToAsk": [
    "<question1>",
    "<question2>",
    "<question3>"
  ],
  "stayCalm": ["<technique1>", "<technique2>"]
}`

    const { text: prepText } = await generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.7,
    })

    // Parse response
    let prepMaterials
    try {
      const jsonMatch = prepText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        prepMaterials = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseError) {
      console.error('[v0] Failed to parse interview prep:', parseError)
      prepMaterials = {
        commonQuestions: [
          {
            question: 'Tell me about yourself',
            tips: ['Be concise', 'Highlight relevant experience'],
            sampleAnswer: 'I am a professional with X years of experience in...',
          },
        ],
        companySpecificQuestions: [
          {
            question: 'Why do you want to work at this company?',
            whatTheyWantToKnow: 'Your genuine interest and knowledge of the company',
            sampleAnswer: 'I am impressed by the company&apos;s...',
          },
        ],
        technicalTopics: [],
        companyResearch: {
          recentNews: [],
          competitorAnalysis: 'Research the company&apos;s competitors',
          culturalValues: [],
        },
        interviewTips: ['Prepare examples', 'Practice', 'Get good sleep'],
        questionsToAsk: [
          'What does success look like in this role?',
          'How is performance measured?',
        ],
        stayCalm: ['Deep breathing', 'Positive visualization'],
      }
    }

    // Track usage
    await db.insert(userAnalytics).values({
      id: uuidv4(),
      user_id: user.id,
      event_type: 'interview_prep_generated',
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
      prepMaterials,
      generated_at: new Date(),
    })
  } catch (error) {
    console.error('[v0] Interview prep error:', error)
    return NextResponse.json({ error: 'Failed to generate interview prep' }, { status: 500 })
  }
}
