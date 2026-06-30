import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerSupabase } from '@/lib/supabase/server'

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
      location,
      company,
      offerSalary,
      yearsExperience,
      skills,
    } = await request.json()

    if (!jobTitle || !offerSalary) {
      return NextResponse.json(
        { error: 'Job title and offer salary required' },
        { status: 400 }
      )
    }

    const prompt = `You are a salary negotiation expert. Analyze this job offer and provide negotiation advice.

JOB TITLE: ${jobTitle}
LOCATION: ${location || 'Not specified'}
COMPANY: ${company || 'Not specified'}
OFFER SALARY: $${offerSalary}
YEARS EXPERIENCE: ${yearsExperience || 'Not specified'}
KEY SKILLS: ${skills?.join(', ') || 'Not specified'}

Provide salary negotiation advice in JSON format:
{
  "marketRate": {
    "low": <number>,
    "average": <number>,
    "high": <number>,
    "currency": "USD"
  },
  "offerAnalysis": {
    "percentOfAverage": "<percentage>",
    "competitiveness": "below|at|above_market",
    "assessment": "<analysis>"
  },
  "negotiationStrategy": {
    "shouldNegotiate": true|false,
    "recommendedSalary": <number>,
    "rationale": "<why>"
  },
  "negotiationTips": [
    {
      "tip": "<tip>",
      "reasoning": "<why this works>"
    }
  ],
  "benefitsToConsider": [
    {
      "benefit": "<benefit_name>",
      "estimatedValue": "$<amount>",
      "importance": "high|medium|low"
    }
  ],
  "redFlags": ["<flag1>", "<flag2>"],
  "scriptExamples": [
    {
      "situation": "<situation>",
      "script": "<what_to_say>"
    }
  ],
  "decisionFactors": {
    "acceptIf": ["<condition1>", "<condition2>"],
    "negotiateIf": ["<condition1>", "<condition2>"],
    "rejectIf": ["<condition1>", "<condition2>"]
  }
}`

    const { text: adviceText } = await generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.7,
    })

    // Parse response
    let advice
    try {
      const jsonMatch = adviceText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        advice = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseError) {
      advice = {
        marketRate: { low: offerSalary * 0.85, average: offerSalary, high: offerSalary * 1.15 },
        offerAnalysis: {
          percentOfAverage: '100%',
          competitiveness: 'at_market',
          assessment: 'Competitive offer',
        },
        negotiationStrategy: {
          shouldNegotiate: false,
          recommendedSalary: offerSalary,
          rationale: 'Offer is at market rate',
        },
        negotiationTips: [],
        benefitsToConsider: [],
        redFlags: [],
        scriptExamples: [],
        decisionFactors: {},
      }
    }

    return NextResponse.json({
      success: true,
      advice,
      generated_at: new Date(),
    })
  } catch (error) {
    console.error('[v0] Salary advisor error:', error)
    return NextResponse.json({ error: 'Failed to provide salary advice' }, { status: 500 })
  }
}
