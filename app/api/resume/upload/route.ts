import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { fileUploadService } from '@/lib/services/file-upload.service'
import { apiErrorHandler, successResponse } from '@/lib/errors/error-handler'
import { ResumeUploadSchema } from '@/lib/validation/schemas'
import { AuthenticationError, ValidationError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logging/logger'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new AuthenticationError()
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = (formData.get('title') as string) || 'My Resume'

    if (!file) {
      throw new ValidationError('No file provided')
    }

    // Validate file
    const validation = fileUploadService.validateFile(file)
    if (!validation.valid) {
      throw new ValidationError(validation.error)
    }

    logger.info('Resume upload started', {
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })

    // Upload resume
    const result = await fileUploadService.uploadResume(file, user.id, {
      title,
      extractText: true,
    })

    logger.info('Resume upload completed successfully', {
      resumeId: result.id,
      userId: user.id,
    })

    return successResponse({
      success: true,
      resume: {
        id: result.id,
        title: result.title,
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        uploadedAt: result.uploadedAt,
      },
    }, 201)
  } catch (error) {
    return apiErrorHandler(error, {
      route: '/api/resume/upload',
      method: 'POST',
    })
  }
}
