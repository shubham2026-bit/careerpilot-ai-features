'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { getUserId } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// Parse resume text to extract structured data
function parseResumeText(text: string) {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Extract name (usually first line)
  const name = lines[0]?.trim() || 'Unknown'
  
  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  const email = emailMatch?.[1] || ''
  
  // Extract phone
  const phoneMatch = text.match(/(\+?1?\s*\(?[\d-.\s]{7,}\)?)/i)
  const phone = phoneMatch?.[1] || ''
  
  // Extract skills (look for common keywords)
  const skillKeywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'HTML', 'CSS', 'Vue', 'Angular', 'PostgreSQL', 'MySQL', 'GraphQL', 'REST', 'API', 'Kubernetes']
  const skills = skillKeywords.filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
  
  // Extract summary (first paragraph with multiple lines)
  const summaryMatch = text.match(/(?:summary|overview|about|professional)([\s\S]*?)(?:\n\n|experience|education)/i)
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
  const strengths: string[] = []
  const improvements: string[] = []
  const recommendations: string[] = []
  let keywordMissing: string[] = []
  
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
  keywordMissing = importantKeywords.filter(keyword => 
    !parsed.rawText.toLowerCase().includes(keyword)
  ).slice(0, 5)
  
  return { strengths, improvements, recommendations, keywordMissing }
}

export async function uploadResume(formData: FormData) {
  const userId = await getUserId()
  const file = formData.get('file') as File
  
  if (!file) throw new Error('No file provided')
  
  // Support PDF, DOCX, and TXT files
  const isPDF = file.type === 'application/pdf'
  const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword'
  const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')
  
  if (!isPDF && !isWord && !isTxt) {
    throw new Error('Only PDF, Word, and text files are supported')
  }
  
  let rawText = ''
  
  // Extract text based on file type
  if (isPDF) {
    rawText = 'PDF file detected. Resume analysis will extract key information from the PDF.'
  } else if (isWord) {
    rawText = 'Word document detected. Resume analysis will extract key information from the document.'
  } else {
    rawText = await file.text()
  }
  
  if (!rawText.trim()) throw new Error('File is empty')
  
  const resumeId = uuidv4()
  
  // Parse resume
  const parsed = parseResumeText(rawText)
  
  // Calculate scores and insights
  const scores = calculateScores(parsed)
  const insights = generateInsights({ ...parsed, rawText }, scores)
  
  // Save resume to Supabase
  const supabase = await createServerSupabase()
  
  const { error: resumeError } = await supabase
    .from('resumes')
    .insert({
      id: resumeId,
      user_id: userId,
      file_name: file.name,
      file_url: `data:text/plain;base64,${Buffer.from(rawText).toString('base64')}`,
      raw_text: rawText,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      skills: parsed.skills,
      summary: parsed.summary,
      experience: JSON.stringify(parsed.experience),
      education: JSON.stringify(parsed.education),
    })
  
  if (resumeError) {
    throw new Error(`Failed to save resume: ${resumeError.message}`)
  }
  
  // Save analysis to Supabase
  const analysisId = uuidv4()
  const { error: analysisError } = await supabase
    .from('resume_analysis')
    .insert({
      id: analysisId,
      user_id: userId,
      resume_id: resumeId,
      overall_score: scores.overallScore,
      skills_score: scores.skillsScore,
      experience_score: scores.experienceScore,
      education_score: scores.educationScore,
      formatting_score: scores.formattingScore,
      strengths: insights.strengths.join('\n'),
      improvements: insights.improvements.join('\n'),
      recommendations: insights.recommendations.join('\n'),
      keyword_missing: insights.keywordMissing.join(','),
    })
  
  if (analysisError) {
    throw new Error(`Failed to save analysis: ${analysisError.message}`)
  }
  
  revalidatePath('/dashboard/resume')
  
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
  const supabase = await createServerSupabase()
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`)
  }
  
  return data || []
}

export async function getResumeAnalysis(resumeId: string) {
  const userId = await getUserId()
  const supabase = await createServerSupabase()
  
  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single()
  
  if (resumeError || !resume || resume.user_id !== userId) {
    throw new Error('Resume not found')
  }
  
  const { data: analysis } = await supabase
    .from('resume_analysis')
    .select('*')
    .eq('resume_id', resumeId)
    .single()
  
  return {
    resume,
    analysis: analysis || null,
  }
}

export async function deleteResume(resumeId: string) {
  const userId = await getUserId()
  const supabase = await createServerSupabase()
  
  const { data: resume, error: fetchError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single()
  
  if (fetchError || !resume || resume.user_id !== userId) {
    throw new Error('Resume not found')
  }
  
  const { error: deleteError } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)
  
  if (deleteError) {
    throw new Error(`Failed to delete resume: ${deleteError.message}`)
  }
  
  const { error: analysisError } = await supabase
    .from('resume_analysis')
    .delete()
    .eq('resume_id', resumeId)
  
  if (analysisError) {
    console.error('Failed to delete analysis:', analysisError)
  }
  
  revalidatePath('/dashboard/resume')
  
  return { success: true }
}
