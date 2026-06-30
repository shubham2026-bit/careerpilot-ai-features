import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { resumes } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string || 'My Resume'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX are supported.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // For now, we'll store the file as-is
    // PDF/DOCX parsing can be done via external services like Amazon Textract or similar
    const extractedText = 'Resume content will be extracted by backend service'
    const buffer = await file.arrayBuffer()

    // Store resume metadata in database
    const resumeId = uuidv4()
    const fileName = `${resumeId}-${file.name}`

    // Store in Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const { data: storageData, error: storageError } = await supabase.storage
      .from('resumes')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error('[v0] Storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to store resume file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName)

    // Save to database
    await db.insert(resumes).values({
      id: resumeId,
      user_id: user.id,
      title,
      file_name: file.name,
      file_path: data.publicUrl,
      file_size: file.size,
      file_type: file.type,
      content: extractedText,
      is_primary: false,
      created_at: new Date(),
      updated_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      resume: {
        id: resumeId,
        title,
        fileName: file.name,
        fileUrl: data.publicUrl,
        uploadedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('[v0] Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}
