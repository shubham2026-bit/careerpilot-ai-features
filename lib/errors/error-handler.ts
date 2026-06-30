import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, ValidationError, isAppError, getErrorStatusCode } from './app-error'
import { logger } from '@/lib/logging/logger'

/**
 * Centralized API error handler for Next.js route handlers
 */
export async function apiErrorHandler(
  error: unknown,
  context?: {
    route?: string
    userId?: string
    method?: string
    requestId?: string
  }
) {
  const requestId = context?.requestId || generateRequestId()
  const route = context?.route || 'unknown'
  
  // Log the error
  logError(error, { ...context, requestId })

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = new ValidationError('Validation failed', {
      errors: error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    })
    
    return NextResponse.json(validationError.toJSON(), {
      status: validationError.statusCode,
      headers: { 'x-request-id': requestId },
    })
  }

  // Handle AppError
  if (isAppError(error)) {
    return NextResponse.json(
      {
        ...error.toJSON(),
        requestId,
      },
      {
        status: error.statusCode,
        headers: { 'x-request-id': requestId },
      }
    )
  }

  // Handle standard Error
  if (error instanceof Error) {
    console.error('[v0] Unhandled error:', {
      requestId,
      route,
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        requestId,
      },
      {
        status: 500,
        headers: { 'x-request-id': requestId },
      }
    )
  }

  // Handle unknown errors
  console.error('[v0] Unknown error type:', {
    requestId,
    route,
    error,
  })

  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      requestId,
    },
    {
      status: 500,
      headers: { 'x-request-id': requestId },
    }
  )
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function createApiHandler<T = any>(
  handler: (request: NextRequest, context?: any) => Promise<T>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      const route = new URL(request.url).pathname
      const method = request.method
      
      // Get user ID from auth if available
      let userId: string | undefined
      try {
        const header = request.headers.get('authorization')
        if (header?.startsWith('Bearer ')) {
          // Parse JWT or session token if needed
          userId = 'user-id-from-token' // Implementation specific
        }
      } catch (e) {
        // Ignore auth parsing errors
      }

      return await handler(request, context)
    } catch (error) {
      return apiErrorHandler(error, {
        route: new URL(request.url).pathname,
        method: request.method,
        userId: context?.userId,
      })
    }
  }
}

/**
 * Logging utility for errors
 */
function logError(
  error: unknown,
  context?: {
    route?: string
    userId?: string
    method?: string
    requestId?: string
  }
) {
  const level = isAppError(error) && error.statusCode < 500 ? 'warn' : 'error'
  
  const errorData = {
    timestamp: new Date().toISOString(),
    ...context,
    errorType: error instanceof Error ? error.constructor.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  }

  if (level === 'error') {
    console.error('[v0] API Error:', errorData)
  } else {
    console.warn('[v0] API Warning:', errorData)
  }
}

/**
 * Generate request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

/**
 * Success response wrapper
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200,
  requestId?: string
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(requestId && { requestId }),
    },
    {
      status: statusCode,
      headers: requestId ? { 'x-request-id': requestId } : {},
    }
  )
}

/**
 * Paginated response wrapper
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200,
  requestId?: string
) {
  const totalPages = Math.ceil(total / limit)
  
  return NextResponse.json(
    {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      ...(requestId && { requestId }),
    },
    {
      status: statusCode,
      headers: requestId ? { 'x-request-id': requestId } : {},
    }
  )
}
