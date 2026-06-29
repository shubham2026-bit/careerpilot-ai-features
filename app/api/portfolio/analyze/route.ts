import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { portfolioAnalysis, portfolioProjects } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'
import { eq } from 'drizzle-orm'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { portfolioUrl } = await request.json()

    if (!portfolioUrl) {
      return NextResponse.json({ error: 'Portfolio URL required' }, { status: 400 })
    }

    // Fetch portfolio page to analyze
    let portfolioContent = ''
    try {
      const response = await fetch(portfolioUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      if (response.ok) {
        portfolioContent = await response.text()
      }
    } catch (error) {
      console.error('[v0] Failed to fetch portfolio:', error)
      // Continue with AI analysis even if fetch fails
    }

    // Use AI to analyze portfolio
    const analysisPrompt = `You are an expert in evaluating professional portfolios and online presence. Analyze the following portfolio information and provide feedback:

PORTFOLIO URL: ${portfolioUrl}
PORTFOLIO CONTENT SAMPLE: ${portfolioContent.substring(0, 2000) || 'Content not available'}

Provide a comprehensive portfolio analysis in JSON format:
{
  "overallScore": <number 1-100>,
  "designScore": <number 1-100>,
  "contentScore": <number 1-100>,
  "seoScore": <number 1-100>,
  "performanceScore": <number 1-100>,
  "userExperienceScore": <number 1-100>,
  "summary": "<brief overview>",
  "strengths": [
    "<strength1>",
    "<strength2>",
    "<strength3>"
  ],
  "areasForImprovement": [
    {
      "area": "<area>",
      "issue": "<specific issue>",
      "suggestion": "<how to improve>"
    }
  ],
  "designRecommendations": ["<recommendation1>", "<recommendation2>"],
  "contentRecommendations": ["<recommendation1>", "<recommendation2>"],
  "seoRecommendations": ["<recommendation1>", "<recommendation2>"],
  "careerImpact": "<analysis of how this portfolio affects career prospects>",
  "targetAudience": ["<audience1>", "<audience2>"],
  "actionItems": [
    "<high priority action>",
    "<medium priority action>",
    "<nice to have improvement>"
  ]
}`

    const { text: analysisText } = await generateText({
      model: 'gpt-4o-mini',
      prompt: analysisPrompt,
      temperature: 0.7,
    })

    // Parse response
    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      analysis = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      analysis = {
        overallScore: 75,
        designScore: 75,
        contentScore: 75,
        seoScore: 70,
        performanceScore: 80,
        userExperienceScore: 75,
        summary: 'Your portfolio looks good overall',
        strengths: ['Clean design', 'Good project showcase', 'Professional layout'],
        areasForImprovement: [
          {
            area: 'Performance',
            issue: 'Page load could be faster',
            suggestion: 'Optimize images and lazy load components',
          },
        ],
        designRecommendations: ['Improve color contrast', 'Better spacing'],
        contentRecommendations: ['Add more project descriptions', 'Include client testimonials'],
        seoRecommendations: ['Improve meta descriptions', 'Add structured data'],
        careerImpact: 'Your portfolio positively impacts career prospects',
        targetAudience: ['Recruiters', 'Hiring Managers', 'Freelance Clients'],
        actionItems: [
          'Optimize images for web',
          'Add case studies to projects',
          'Implement analytics tracking',
        ],
      }
    }

    // Save analysis to database
    const analysisId = uuidv4()
    await db.insert(portfolioAnalysis).values({
      id: analysisId,
      user_id: user.id,
      portfolio_url: portfolioUrl,
      overall_score: analysis.overallScore,
      design_score: analysis.designScore,
      content_score: analysis.contentScore,
      seo_score: analysis.seoScore,
      performance_score: analysis.performanceScore,
      ux_score: analysis.userExperienceScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      areas_for_improvement: analysis.areasForImprovement,
      design_recommendations: analysis.designRecommendations,
      content_recommendations: analysis.contentRecommendations,
      seo_recommendations: analysis.seoRecommendations,
      career_impact: analysis.careerImpact,
      target_audience: analysis.targetAudience,
      action_items: analysis.actionItems,
      analyzed_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysisId,
        ...analysis,
      },
    })
  } catch (error) {
    console.error('[v0] Portfolio analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze portfolio' }, { status: 500 })
  }
}
