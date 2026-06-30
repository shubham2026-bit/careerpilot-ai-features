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
      currentSkills,
      targetRole,
      targetCompany,
      experienceLevel,
    } = await request.json()

    if (!currentSkills || !targetRole) {
      return NextResponse.json(
        { error: 'Current skills and target role required' },
        { status: 400 }
      )
    }

    const prompt = `Analyze the skill gap for someone transitioning to a new role.

CURRENT SKILLS: ${currentSkills.join(', ')}
TARGET ROLE: ${targetRole}
${targetCompany ? `TARGET COMPANY: ${targetCompany}` : ''}
EXPERIENCE LEVEL: ${experienceLevel || 'Mid-level'}

Provide a comprehensive skill gap analysis in JSON format:
{
  "skillsToKeep": ["<skill1>", "<skill2>"],
  "skillsToLearn": [
    {
      "skill": "<skill_name>",
      "priority": "high|medium|low",
      "timeToLearn": "<estimated_time>",
      "resources": ["<resource1>", "<resource2>"],
      "why": "<why this skill is needed>"
    }
  ],
  "skillsToImprove": [
    {
      "skill": "<skill_name>",
      "currentLevel": "beginner|intermediate|advanced",
      "targetLevel": "advanced|expert",
      "actionItems": ["<action1>", "<action2>"]
    }
  ],
  "learningPath": [
    {
      "phase": "<phase_name>",
      "duration": "<duration>",
      "focus": ["<skill1>", "<skill2>"],
      "milestones": ["<milestone1>"]
    }
  ],
  "recommendedCertifications": ["<cert1>", "<cert2>"],
  "timelineToTransition": "<estimated_timeline>",
  "successMetrics": ["<metric1>", "<metric2>"]
}`

    const { text: analysisText } = await generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.7,
    })

    // Parse response
    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseError) {
      analysis = {
        skillsToKeep: currentSkills,
        skillsToLearn: [],
        skillsToImprove: [],
        learningPath: [],
        recommendedCertifications: [],
        timelineToTransition: '3-6 months',
        successMetrics: [],
      }
    }

    // Track usage
    await db.insert(userAnalytics).values({
      id: uuidv4(),
      user_id: user.id,
      event_type: 'skill_gap_analyzed',
      event_data: {
        targetRole,
        targetCompany,
      },
      created_at: new Date(),
    }).catch((error) => {
      console.error('[v0] Failed to track analytics:', error)
    })

    return NextResponse.json({
      success: true,
      analysis,
      generated_at: new Date(),
    })
  } catch (error) {
    console.error('[v0] Skill gap analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze skill gap' }, { status: 500 })
  }
}
