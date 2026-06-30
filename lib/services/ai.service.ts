import { generateText, streamText } from 'ai'
import { logger, PerformanceTimer } from '@/lib/logging/logger'
import { ExternalServiceError } from '@/lib/errors/app-error'

/**
 * AI Service - Centralized LLM abstraction
 * Supports multiple providers and models with fallback logic
 */

export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-opus' | 'gemini-pro'
export type AIProvider = 'openai' | 'anthropic' | 'google'

export interface AIGenerationOptions {
  model?: AIModel
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  systemPrompt?: string
}

export interface AIStreamOptions extends AIGenerationOptions {
  onChunk?: (chunk: string) => void
}

/**
 * Prompt templates for different AI tasks
 */
export const PROMPT_TEMPLATES = {
  COVER_LETTER: (data: {
    jobTitle: string
    company: string
    jobDescription: string
    userBackground: string
    tone: string
  }) => `Write a compelling cover letter for the following position:

JOB TITLE: ${data.jobTitle}
COMPANY: ${data.company}
JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE BACKGROUND:
${data.userBackground}

TONE: ${data.tone}

Generate a professional cover letter that:
1. Opens with a strong hook specific to the company and role
2. Highlights relevant skills and experiences from the job description
3. Shows genuine interest in the company and role
4. Includes specific achievements and quantifiable results
5. Closes with a call to action
6. Is 3-4 paragraphs long
7. Has a ${data.tone} tone

Format it as a complete cover letter ready to send.`,

  RESUME_ANALYSIS: (data: {
    resumeContent: string
    jobDescription?: string
  }) => `Analyze the following resume and provide constructive feedback:

RESUME:
${data.resumeContent}

${data.jobDescription ? `TARGET JOB:\n${data.jobDescription}` : ''}

Provide detailed analysis in the following JSON format:
{
  "overallScore": <1-100>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": ["<improvement1>", "<improvement2>", "<improvement3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "recommendations": ["<recommendation1>", "<recommendation2>"],
  "formattingScore": <1-100>,
  "contentScore": <1-100>,
  "impactScore": <1-100>
}`,

  INTERVIEW_PREP: (data: {
    jobTitle: string
    company: string
    role: string
    experience: string
  }) => `Generate interview preparation questions and tips for this position:

JOB TITLE: ${data.jobTitle}
COMPANY: ${data.company}
ROLE: ${data.role}
EXPERIENCE LEVEL: ${data.experience}

Provide in JSON format:
{
  "technicalQuestions": ["<question1>", "<question2>"],
  "behavioralQuestions": ["<question1>", "<question1>"],
  "companyCulture": "<brief company culture overview>",
  "keyTopics": ["<topic1>", "<topic2>"],
  "tips": ["<tip1>", "<tip2>", "<tip3>"],
  "estimatedSalaryRange": "<salary range>"
}`,

  SKILL_GAP: (data: {
    currentSkills: string[]
    targetRole: string
    experience: string
  }) => `Analyze the skill gap for the following profile:

CURRENT SKILLS: ${data.currentSkills.join(', ')}
TARGET ROLE: ${data.targetRole}
EXPERIENCE LEVEL: ${data.experience}

Provide learning recommendations in JSON format:
{
  "gapAnalysis": ["<gap1>", "<gap2>"],
  "recommendedSkills": ["<skill1>", "<skill2>"],
  "learningPath": ["<step1>", "<step2>"],
  "estimatedTimeToMaster": "<timeframe>",
  "resources": ["<resource1>", "<resource2>"],
  "priorityLevel": "<high|medium|low>"
}`,

  CAREER_COACHING: (data: { question: string; context?: string }) => `You are an expert career coach with 20+ years of experience.

USER QUESTION: ${data.question}

${data.context ? `CONTEXT:\n${data.context}` : ''}

Provide thoughtful, actionable career advice that:
1. Directly addresses the question
2. Includes specific examples or strategies
3. Is encouraging and constructive
4. Considers long-term career growth`,

  JOB_RECOMMENDATION: (data: {
    skills: string[]
    experience: string
    preferences: string
  }) => `Based on the following profile, suggest relevant job opportunities:

SKILLS: ${data.skills.join(', ')}
EXPERIENCE LEVEL: ${data.experience}
PREFERENCES: ${data.preferences}

Suggest 5 relevant job opportunities in JSON format:
[
  {
    "jobTitle": "<title>",
    "industry": "<industry>",
    "matchScore": <1-100>,
    "requiredSkills": ["<skill1>"],
    "salaryRange": "<range>",
    "careerGrowth": "<potential>"
  }
]`,
}

class AIService {
  private defaultModel: AIModel = 'gpt-4o-mini'
  private fallbackModel: AIModel = 'gpt-4o-mini'
  private apiKey = process.env.OPENAI_API_KEY

  constructor() {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
  }

  /**
   * Generate text completion
   */
  async generate(
    prompt: string,
    options?: AIGenerationOptions
  ): Promise<string> {
    const timer = new PerformanceTimer()
    const model = options?.model || this.defaultModel

    try {
      logger.debug('Generating text', { model, prompt: prompt.substring(0, 100) })

      const { text } = await generateText({
        model: this.getOpenAIModel(model),
        prompt,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 2000,
        system: options?.systemPrompt,
        topP: options?.topP,
        frequencyPenalty: options?.frequencyPenalty,
        presencePenalty: options?.presencePenalty,
      })

      logger.logMetric('ai-generation', timer.duration(), 'ms', { model, tokenEstimate: Math.ceil(text.length / 4) })

      return text
    } catch (error) {
      logger.error('AI generation failed', error as Error, { model })
      throw new ExternalServiceError('OpenAI', 'Failed to generate text')
    }
  }

  /**
   * Stream text generation
   */
  async stream(
    prompt: string,
    options?: AIStreamOptions
  ): Promise<AsyncIterable<string>> {
    const model = options?.model || this.defaultModel

    try {
      const { textStream } = await streamText({
        model: this.getOpenAIModel(model),
        prompt,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 2000,
        system: options?.systemPrompt,
      })

      return textStream
    } catch (error) {
      logger.error('AI streaming failed', error as Error, { model })
      throw new ExternalServiceError('OpenAI', 'Failed to stream text')
    }
  }

  /**
   * Generate cover letter
   */
  async generateCoverLetter(data: {
    jobTitle: string
    company: string
    jobDescription: string
    userBackground: string
    tone?: string
  }): Promise<string> {
    const prompt = PROMPT_TEMPLATES.COVER_LETTER({
      ...data,
      tone: data.tone || 'professional',
    })

    return this.generate(prompt, {
      temperature: 0.8,
      maxTokens: 1024,
    })
  }

  /**
   * Analyze resume
   */
  async analyzeResume(content: string, jobDescription?: string): Promise<any> {
    const prompt = PROMPT_TEMPLATES.RESUME_ANALYSIS({
      resumeContent: content,
      jobDescription,
    })

    const result = await this.generate(prompt, { temperature: 0.5, maxTokens: 1024 })

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : this.parseJSONResponse(result)
    } catch {
      logger.warn('Failed to parse resume analysis JSON', { result: result.substring(0, 200) })
      return {
        overallScore: 75,
        strengths: ['Review manually'],
        improvements: ['Review manually'],
      }
    }
  }

  /**
   * Prepare for interview
   */
  async interviewPrep(data: {
    jobTitle: string
    company: string
    role?: string
    experience?: string
  }): Promise<any> {
    const prompt = PROMPT_TEMPLATES.INTERVIEW_PREP({
      jobTitle: data.jobTitle,
      company: data.company,
      role: data.role || data.jobTitle,
      experience: data.experience || 'mid',
    })

    const result = await this.generate(prompt, { temperature: 0.6, maxTokens: 1024 })

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch {
      logger.warn('Failed to parse interview prep JSON')
      return { questions: [], tips: [] }
    }
  }

  /**
   * Analyze skill gap
   */
  async analyzeSkillGap(data: {
    currentSkills: string[]
    targetRole: string
    experience?: string
  }): Promise<any> {
    const prompt = PROMPT_TEMPLATES.SKILL_GAP({
      ...data,
      experience: data.experience || 'mid',
    })

    const result = await this.generate(prompt, { temperature: 0.7, maxTokens: 1024 })

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch {
      logger.warn('Failed to parse skill gap JSON')
      return { gapAnalysis: [], recommendations: [] }
    }
  }

  /**
   * Career coaching chat
   */
  async careerCoach(question: string, context?: string): Promise<string> {
    const prompt = PROMPT_TEMPLATES.CAREER_COACHING({ question, context })

    return this.generate(prompt, {
      temperature: 0.8,
      maxTokens: 1500,
      systemPrompt: 'You are an empathetic and knowledgeable career coach.',
    })
  }

  /**
   * Get OpenAI model string
   */
  private getOpenAIModel(model: AIModel): string {
    const modelMap: Record<AIModel, string> = {
      'gpt-4o': 'gpt-4o',
      'gpt-4o-mini': 'gpt-4o-mini',
      'claude-3-opus': 'claude-3-5-sonnet-20241022',
      'gemini-pro': 'gemini-1.5-pro',
    }

    return modelMap[model] || modelMap['gpt-4o-mini']
  }

  /**
   * Parse JSON from AI response
   */
  private parseJSONResponse(text: string): any {
    try {
      return JSON.parse(text)
    } catch {
      // Try to extract JSON object or array
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return {}
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
