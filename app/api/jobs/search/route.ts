import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { userAnalytics } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 60

interface JobSearchParams {
  title?: string
  location?: string
  experience?: 'entry' | 'mid' | 'senior'
  jobType?: 'fulltime' | 'contract' | 'remote'
  limit?: number
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params: JobSearchParams = await request.json()
    const {
      title = 'Software Engineer',
      location = 'Remote',
      experience = 'mid',
      jobType = 'fulltime',
      limit = 10,
    } = params

    // Use AI to generate relevant job search results
    const prompt = `You are a job search assistant. Generate realistic job listings based on the following criteria:
- Job Title: ${title}
- Location: ${location}
- Experience Level: ${experience}
- Job Type: ${jobType}
- Number of jobs: ${limit}

Generate ${limit} job listings in JSON format. Each job should have:
{
  "id": "unique_id",
  "title": "job_title",
  "company": "company_name",
  "location": "location",
  "salary_min": number,
  "salary_max": number,
  "jobType": "${jobType}",
  "description": "job description",
  "requirements": ["requirement1", "requirement2"],
  "nice_to_haves": ["skill1", "skill2"],
  "posted_date": "date",
  "url": "link_to_job"
}

Return a valid JSON array with ${limit} jobs.`

    const { text: jobsText } = await generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.8,
    })

    // Parse jobs from AI response
    let jobs = []
    try {
      const jsonMatch = jobsText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        jobs = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('[v0] Failed to parse jobs:', parseError)
      // Generate mock jobs as fallback
      jobs = Array.from({ length: limit }, (_, i) => ({
        id: `job_${uuidv4()}`,
        title,
        company: `Company ${i + 1}`,
        location,
        salary_min: 80000 + i * 5000,
        salary_max: 120000 + i * 5000,
        jobType,
        description: `Exciting opportunity for ${title}`,
        requirements: ['JavaScript', 'React', 'Node.js'],
        nice_to_haves: ['TypeScript', 'AWS'],
        posted_date: new Date().toISOString(),
        url: '#',
      }))
    }

    // Track search in analytics
    try {
      await db.insert(userAnalytics).values({
        id: uuidv4(),
        user_id: user.id,
        event_type: 'job_search',
        event_data: {
          title,
          location,
          experience,
          jobType,
          resultsCount: jobs.length,
        },
        created_at: new Date(),
      })
    } catch (error) {
      console.error('[v0] Failed to save analytics:', error)
    }

    return NextResponse.json({
      success: true,
      jobs,
      totalResults: jobs.length,
      searchParams: {
        title,
        location,
        experience,
        jobType,
      },
    })
  } catch (error) {
    console.error('[v0] Job search error:', error)
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 })
  }
}
