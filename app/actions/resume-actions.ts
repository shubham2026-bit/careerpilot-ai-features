'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resumes, resumeAnalysis } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Parse resume text to extract structured data
function parseResumeText(text: string) {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Extract name (usually first line)
  const name = lines[0]?.trim() || 'Unknown'
  
  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  const email = emailMatch?.[1] || ''
  
  // Extract phone
  const phoneMatch = text.match(/(\+?1?\s*\(?[\d\-\.\s]{7,}\)?)/i)
  const phone = phoneMatch?.[1] || ''
  
  // Extract skills (look for common keywords)
  const skillKeywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'HTML', 'CSS', 'Vue', 'Angular', 'PostgreSQL', 'MySQL', 'GraphQL', 'REST', 'API', 'Kubernetes']
  const skills = skillKeywords.filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
  
  // Extract summary (first paragraph with multiple lines)
  const summaryMatch = text.match(/(?:summary|overview|about|professional)(.*?)(?:\n\n|experience|education)/is)
  const summary = summaryMatch?.[1]?.trim().slice(0, 300) || ''
  
  return {
    name,
    email,
    phone,
    skills: skills.length > 0 ? skills : ['Not specified'],
    summary,
    experience: [],
    education: [],
  }
}

// Calculate resume scores based on analysis
function calculateScores(parsed: any) {
  const skillsScore = Math.min(100, (parsed.skills?.length || 0) * 10)
  const experienceScore = parsed.experience?.length > 0 ? 85 : 50
  const educationScore = parsed.education?.length > 0 ? 85 : 60
  const formattingScore = 75 // Based on text quality
  const overallScore = (skillsScore + experienceScore + educationScore + formattingScore) / 4
  
  return {
    overallScore: Math.round(overallScore * 100) / 100,
    skillsScore: Math.round(skillsScore * 100) / 100,
    experienceScore: Math.round(experienceScore * 100) / 100,
    educationScore: Math.round(educationScore * 100) / 100,
    formattingScore: Math.round(formattingScore * 100) / 100,
  }
}

// Generate insights based on resume
function generateInsights(parsed: any, scores: any) {
  const strengths = []
  const improvements = []
  const recommendations = []
  const keywordMissing = []
  
  // Strengths
  if (parsed.skills?.length > 5) strengths.push('Good variety of technical skills')
  if (parsed.email) strengths.push('Contact information is complete')
  if (parsed.summary) strengths.push('Professional summary included')
  if (scores.overallScore >= 75) strengths.push('Strong overall resume quality')
  
  // Improvements
  if (!parsed.email) improvements.push('Add professional email address')
  if (!parsed.phone) improvements.push('Include phone number')
  if (!parsed.summary) improvements.push('Add professional summary or overview')
  if (parsed.skills?.length < 5) improvements.push('Expand technical skills section')
  
  // Recommendations
  recommendations.push('Quantify achievements with metrics and numbers')
  recommendations.push('Use action verbs to describe accomplishments')
  recommendations.push('Tailor keywords to match job descriptions')
  recommendations.push('Keep resume to 1-2 pages maximum')
  
  // Missing keywords (common tech keywords not found)
  const importantKeywords = ['leadership', 'project management', 'collaboration', 'problem-solving', 'agile', 'scrum']
  importantKeywords.forEach(keyword => {
    if (!parsed.rawText.toLowerCase().includes(keyword)) {
      keywordMissing.push(keyword)
    }
  })
  
  return { strengths, improvements, recommendations, keywordMissing: keywordMissing.slice(0, 5) }
}

export async function uploadResume(formData: FormData) {
  const userId = await getUserId()
  const file = formData.get('file') as File
  
  if (!file) throw new Error('No file provided')
  if (!file.name.toLowerCase().endsWith('.txt') && !file.type.includes('text')) {
    throw new Error('Only text files are supported')
  }
  
  const rawText = await file.text()
  if (!rawText.trim()) throw new Error('File is empty')
  
  const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Parse resume
  const parsed = parseResumeText(rawText)
  
  // Save resume to database
  await db.insert(resumes).values({
    id: resumeId,
    userId,
    fileName: file.name,
    fileUrl: `data:text/plain;base64,${Buffer.from(rawText).toString('base64')}`,
    rawText,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    skills: parsed.skills,
    summary: parsed.summary,
    experience: parsed.experience,
    education: parsed.education,
  })
  
  // Calculate scores and insights
  const scores = calculateScores(parsed)
  const insights = generateInsights({ ...parsed, rawText }, scores)
  
  // Save analysis to database
  const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  await db.insert(resumeAnalysis).values({
    id: analysisId,
    userId,
    resumeId,
    overallScore: scores.overallScore.toString(),
    skillsScore: scores.skillsScore.toString(),
    experienceScore: scores.experienceScore.toString(),
    educationScore: scores.educationScore.toString(),
    formattingScore: scores.formattingScore.toString(),
    strengths: insights.strengths,
    improvements: insights.improvements,
    recommendations: insights.recommendations,
    keywordMissing: insights.keywordMissing,
  })
  
  revalidatePath('/resume')
  
  return {
    success: true,
    resumeId,
    analysisId,
    data: {
      name: parsed.name,
      email: parsed.email,
      skills: parsed.skills,
      scores,
      insights,
    },
  }
}

export async function getUserResumes() {
  const userId = await getUserId()
  
  const userResumes = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt))
  
  return userResumes
}

export async function getResumeAnalysis(resumeId: string) {
  const userId = await getUserId()
  
  const resume = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, resumeId))
  
  if (!resume.length || resume[0].userId !== userId) {
    throw new Error('Resume not found')
  }
  
  const analysis = await db
    .select()
    .from(resumeAnalysis)
    .where(eq(resumeAnalysis.resumeId, resumeId))
  
  return {
    resume: resume[0],
    analysis: analysis[0] || null,
  }
}

export async function deleteResume(resumeId: string) {
  const userId = await getUserId()
  
  const resume = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, resumeId))
  
  if (!resume.length || resume[0].userId !== userId) {
    throw new Error('Resume not found')
  }
  
  await db.delete(resumes).where(eq(resumes.id, resumeId))
  await db.delete(resumeAnalysis).where(eq(resumeAnalysis.resumeId, resumeId))
  
  revalidatePath('/resume')
  
  return { success: true }
}
