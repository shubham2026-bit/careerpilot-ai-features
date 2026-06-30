import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { resumes } from '@/lib/db/schema'
import { ValidationError, InternalError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logging/logger'
import { v4 as uuidv4 } from 'uuid'
import * as pdfParse from 'pdf-parse'

/**
 * File Upload Service - Handles resume and document uploads
 * Supports PDF and DOCX files up to 10MB
 */

export interface UploadOptions {
  title?: string
  isPrimary?: boolean
  extractText?: boolean
}

export interface UploadResult {
  id: string
  title: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  extractedText?: string
  uploadedAt: Date
}

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

class FileUploadService {
  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      }
    }

    // Check file type
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only PDF and DOCX files are supported',
      }
    }

    // Check file name
    if (!file.name || file.name.length === 0) {
      return {
        valid: false,
        error: 'File must have a name',
      }
    }

    return { valid: true }
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadToStorage(file: File, userId: string): Promise<{
    fileName: string
    fileUrl: string
  }> {
    try {
      const supabase = await createServerSupabase()

      // Generate unique file name
      const fileId = uuidv4()
      const ext = this.getFileExtension(file.name)
      const fileName = `${userId}/${fileId}.${ext}`

      // Upload to storage
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (error) {
        logger.error('Storage upload failed', error, { fileName, fileSize: file.size })
        throw new InternalError('Failed to store file')
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      return {
        fileName: file.name,
        fileUrl: urlData.publicUrl,
      }
    } catch (error) {
      logger.error('File upload error', error as Error)
      throw error instanceof InternalError ? error : new InternalError('File upload failed')
    }
  }

  /**
   * Extract text from file
   */
  async extractText(file: File): Promise<string> {
    try {
      if (file.type === 'application/pdf') {
        return await this.extractPDFText(file)
      } else if (file.type.includes('wordprocessingml') || file.type.includes('msword')) {
        return await this.extractDocxText(file)
      }
      return ''
    } catch (error) {
      logger.warn('Text extraction failed', { fileName: file.name })
      return ''
    }
  }

  /**
   * Extract text from PDF
   */
  private async extractPDFText(file: File): Promise<string> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const data = await pdfParse(buffer)
      return data.text || ''
    } catch (error) {
      logger.warn('PDF extraction failed', { error })
      return ''
    }
  }

  /**
   * Extract text from DOCX (simplified - returns placeholder)
   * For production, use: mammoth, docx-parser, or similar
   */
  private async extractDocxText(file: File): Promise<string> {
    // Placeholder - in production, use a library like mammoth
    logger.warn('DOCX extraction not fully implemented - using placeholder')
    return `Document: ${file.name}\nContent extraction requires additional setup.`
  }

  /**
   * Save resume metadata to database
   */
  async saveResumeMetadata(data: {
    userId: string
    title: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
    extractedText?: string
    isPrimary?: boolean
  }): Promise<UploadResult> {
    try {
      const resumeId = uuidv4()

      await db.insert(resumes).values({
        id: resumeId,
        userId: data.userId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        rawText: data.extractedText || '',
        content: data.extractedText || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      logger.info('Resume saved to database', { resumeId, userId: data.userId })

      return {
        id: resumeId,
        title: data.title,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        extractedText: data.extractedText,
        uploadedAt: new Date(),
      }
    } catch (error) {
      logger.error('Failed to save resume metadata', error as Error)
      throw new InternalError('Failed to save resume metadata')
    }
  }

  /**
   * Upload and process resume
   */
  async uploadResume(
    file: File,
    userId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new ValidationError(validation.error)
    }

    try {
      // Upload to storage
      const { fileName, fileUrl } = await this.uploadToStorage(file, userId)

      // Extract text if requested
      let extractedText = ''
      if (options.extractText !== false) {
        extractedText = await this.extractText(file)
      }

      // Save metadata
      const result = await this.saveResumeMetadata({
        userId,
        title: options.title || file.name,
        fileName,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        extractedText,
        isPrimary: options.isPrimary,
      })

      logger.info('Resume upload completed', {
        resumeId: result.id,
        fileName: file.name,
        fileSize: file.size,
      })

      return result
    } catch (error) {
      if (error instanceof ValidationError || error instanceof InternalError) {
        throw error
      }
      logger.error('Unexpected error during upload', error as Error)
      throw new InternalError('Upload failed')
    }
  }

  /**
   * Get file extension
   */
  private getFileExtension(fileName: string): string {
    const parts = fileName.split('.')
    return parts[parts.length - 1]?.toLowerCase() || 'pdf'
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Get upload progress
   */
  getProgressPercentage(uploaded: number, total: number): number {
    if (total === 0) return 0
    return Math.round((uploaded / total) * 100)
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService()
