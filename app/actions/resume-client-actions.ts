'use client'

export async function uploadResume(file: File, title: string) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)

    const response = await fetch('/api/resume/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Resume upload error:', error)
    throw error
  }
}

export async function analyzeResume(resumeId: string) {
  try {
    const response = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Analysis failed')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Resume analysis error:', error)
    throw error
  }
}

export async function generateResumeTips(resumeContent: string, jobTitle: string) {
  try {
    const response = await fetch('/api/ai/resume-tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeContent,
        jobTitle,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate tips')
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Resume tips error:', error)
    throw error
  }
}
