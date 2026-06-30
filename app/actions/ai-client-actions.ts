'use client'

export async function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string,
  userBackground: string,
  tone: string = 'professional'
) {
  try {
    const response = await fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle,
        company,
        jobDescription,
        userBackground,
        tone,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate cover letter')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Cover letter generation error:', error)
    throw error
  }
}

export async function generateInterviewPrep(
  jobTitle: string,
  company: string,
  industryType?: string,
  experienceLevel?: string,
  focusAreas?: string[]
) {
  try {
    const response = await fetch('/api/ai/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle,
        company,
        industryType,
        experienceLevel,
        focusAreas,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate interview prep')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Interview prep error:', error)
    throw error
  }
}

export async function searchJobs(
  title?: string,
  location?: string,
  experience?: 'entry' | 'mid' | 'senior',
  jobType?: 'fulltime' | 'contract' | 'remote',
  limit?: number
) {
  try {
    const response = await fetch('/api/jobs/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        location,
        experience,
        jobType,
        limit,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to search jobs')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Job search error:', error)
    throw error
  }
}

export async function analyzePortfolio(portfolioUrl: string) {
  try {
    const response = await fetch('/api/portfolio/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioUrl }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze portfolio')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Portfolio analysis error:', error)
    throw error
  }
}

export async function analyzeGitHub() {
  try {
    const response = await fetch('/api/github/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error('Failed to analyze GitHub')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] GitHub analysis error:', error)
    throw error
  }
}

export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: string,
  targetCompany?: string,
  experienceLevel?: string
) {
  try {
    const response = await fetch('/api/ai/skill-gap-analyzer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentSkills,
        targetRole,
        targetCompany,
        experienceLevel,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze skill gap')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Skill gap analysis error:', error)
    throw error
  }
}

export async function getSalaryAdvice(
  jobTitle: string,
  offerSalary: number,
  location?: string,
  company?: string,
  yearsExperience?: number,
  skills?: string[]
) {
  try {
    const response = await fetch('/api/ai/salary-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle,
        offerSalary,
        location,
        company,
        yearsExperience,
        skills,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get salary advice')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Salary advice error:', error)
    throw error
  }
}
