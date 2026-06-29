'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { linkedinProfiles, linkedinAnalysis, githubProfiles, githubAnalysis, portfolioProjects, portfolioAnalysis } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// LinkedIn Actions
export async function addLinkedInProfile(profileUrl: string, data: any) {
  const userId = await getUserId()
  const id = `linkedin_${Date.now()}`
  
  const analysis = {
    overallScore: 75,
    completenessScore: 80,
    visibilityScore: 70,
    engagementScore: 75,
    strengths: ['Strong headline', 'Good profile picture', 'Detailed experience'],
    improvements: ['Add more details to about section', 'Include certifications'],
    recommendations: ['Request more recommendations', 'Increase activity'],
  }

  await db.insert(linkedinProfiles).values({
    id,
    userId,
    profileUrl,
    fullName: data.fullName || 'Not provided',
    headline: data.headline || '',
    location: data.location || '',
    about: data.about || '',
    connections: data.connections || 0,
    endorsements: data.endorsements || 0,
    skills: data.skills || [],
    experience: data.experience || [],
    education: data.education || [],
  })

  const analysisId = `linkedin_analysis_${Date.now()}`
  await db.insert(linkedinAnalysis).values({
    id: analysisId,
    userId,
    profileId: id,
    overallScore: analysis.overallScore.toString(),
    completenessScore: analysis.completenessScore.toString(),
    visibilityScore: analysis.visibilityScore.toString(),
    engagementScore: analysis.engagementScore.toString(),
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    recommendations: analysis.recommendations,
  })

  revalidatePath('/linkedin')
  return { profileId: id, analysisId, analysis }
}

export async function getLinkedInProfile() {
  const userId = await getUserId()
  const profiles = await db.query.linkedinProfiles.findFirst({
    where: eq(linkedinProfiles.userId, userId),
  })
  return profiles
}

export async function getLinkedInAnalysis(profileId: string) {
  const userId = await getUserId()
  const analysis = await db.query.linkedinAnalysis.findFirst({
    where: eq(linkedinAnalysis.profileId, profileId),
  })
  if (!analysis || analysis.userId !== userId) throw new Error('Unauthorized')
  return { analysis }
}

// GitHub Actions
export async function addGitHubProfile(username: string, data: any) {
  const userId = await getUserId()
  const id = `github_${Date.now()}`

  const analysis = {
    overallScore: 82,
    codeQualityScore: 80,
    activityScore: 85,
    diversityScore: 80,
    strengths: ['Active contributor', 'Good project diversity', 'Well-documented repos'],
    improvements: ['Add more README documentation', 'Increase commit frequency'],
    recommendations: ['Create more public projects', 'Contribute to open source'],
  }

  await db.insert(githubProfiles).values({
    id,
    userId,
    username,
    profileUrl: `https://github.com/${username}`,
    name: data.name || username,
    bio: data.bio || '',
    avatarUrl: data.avatarUrl || '',
    publicRepos: data.publicRepos || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    totalStars: data.totalStars || 0,
    topLanguages: data.topLanguages || [],
    recentProjects: data.recentProjects || [],
  })

  const analysisId = `github_analysis_${Date.now()}`
  await db.insert(githubAnalysis).values({
    id: analysisId,
    userId,
    profileId: id,
    overallScore: analysis.overallScore.toString(),
    codeQualityScore: analysis.codeQualityScore.toString(),
    activityScore: analysis.activityScore.toString(),
    diversityScore: analysis.diversityScore.toString(),
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    recommendations: analysis.recommendations,
  })

  revalidatePath('/github')
  return { profileId: id, analysisId, analysis }
}

export async function getGitHubProfile() {
  const userId = await getUserId()
  const profile = await db.query.githubProfiles.findFirst({
    where: eq(githubProfiles.userId, userId),
  })
  return profile
}

export async function getGitHubAnalysis(profileId: string) {
  const userId = await getUserId()
  const analysis = await db.query.githubAnalysis.findFirst({
    where: eq(githubAnalysis.profileId, profileId),
  })
  if (!analysis || analysis.userId !== userId) throw new Error('Unauthorized')
  return { analysis }
}

// Portfolio Actions
export async function addPortfolioProject(projectData: any) {
  const userId = await getUserId()
  const id = `portfolio_${Date.now()}`

  await db.insert(portfolioProjects).values({
    id,
    userId,
    title: projectData.title,
    description: projectData.description || '',
    url: projectData.url,
    imageUrl: projectData.imageUrl || '',
    technologies: projectData.technologies || [],
    role: projectData.role || '',
    impact: projectData.impact || '',
  })

  revalidatePath('/portfolio')
  return { projectId: id }
}

export async function getPortfolioProjects() {
  const userId = await getUserId()
  const projects = await db.query.portfolioProjects.findMany({
    where: eq(portfolioProjects.userId, userId),
  })
  return projects
}

export async function deletePortfolioProject(projectId: string) {
  const userId = await getUserId()
  const project = await db.query.portfolioProjects.findFirst({
    where: eq(portfolioProjects.id, projectId),
  })
  if (!project || project.userId !== userId) throw new Error('Unauthorized')

  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, projectId))
  revalidatePath('/portfolio')
}

export async function getPortfolioAnalysis() {
  const userId = await getUserId()
  
  const projects = await db.query.portfolioProjects.findMany({
    where: eq(portfolioProjects.userId, userId),
  })

  const analysis = {
    overallScore: projects.length > 0 ? 78 : 50,
    presentationScore: 75,
    diversityScore: 80,
    impactScore: 75,
    strengths: ['Clear project descriptions', 'Good technology mix', 'Impressive scale'],
    improvements: ['Add more technical details', 'Include metrics and outcomes', 'Show team size'],
    recommendations: ['Highlight unique challenges', 'Add live demos or videos', 'Include client testimonials'],
  }

  return { analysis, projectCount: projects.length }
}
