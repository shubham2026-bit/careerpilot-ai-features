/**
 * Centralized logging service for the application
 * Supports different log levels and structured logging
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string
  requestId?: string
  route?: string
  method?: string
  duration?: number
  statusCode?: number
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${this.formatMessage(message, context)}`)
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${this.formatMessage(message, context)}`)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${this.formatMessage(message, context)}`)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorInfo = this.extractErrorInfo(error)
    console.error(`[ERROR] ${this.formatMessage(message, { ...context, ...errorInfo })}`)
  }

  /**
   * Log API request
   */
  logRequest(method: string, route: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[REQUEST] ${method} ${route}`, context || '')
    }
  }

  /**
   * Log API response
   */
  logResponse(method: string, route: string, statusCode: number, duration: number, context?: LogContext) {
    const level = statusCode >= 400 ? console.warn : console.log
    const prefix = statusCode >= 500 ? '[ERROR]' : statusCode >= 400 ? '[WARN]' : '[RESPONSE]'
    
    level(`${prefix} ${method} ${route} ${statusCode} (${duration}ms)`, context || '')
  }

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, context?: LogContext) {
    if (this.isDevelopment && duration > 100) {
      console.log(`[DB-SLOW] Query took ${duration}ms`, query.substring(0, 100), context || '')
    }
  }

  /**
   * Log external service call
   */
  logExternalService(service: string, action: string, duration: number, success: boolean, context?: LogContext) {
    const level = success ? console.log : console.warn
    const prefix = success ? '[EXTERNAL]' : '[EXTERNAL-ERROR]'
    
    level(`${prefix} ${service}.${action} (${duration}ms)`, context || '')
  }

  /**
   * Log performance metric
   */
  logMetric(name: string, value: number, unit: string = 'ms', context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[METRIC] ${name}: ${value}${unit}`, context || '')
    }
  }

  /**
   * Format log message with context
   */
  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message
    }

    const contextStr = Object.entries(context)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')

    return `${message} ${contextStr}`
  }

  /**
   * Extract error information
   */
  private extractErrorInfo(error: unknown): Partial<LogContext> {
    if (!error) return {}

    if (error instanceof Error) {
      return {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      }
    }

    return {
      errorMessage: String(error),
    }
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime = Date.now()

  duration(): number {
    return Date.now() - this.startTime
  }

  log(label: string, context?: LogContext) {
    logger.logMetric(label, this.duration(), 'ms', context)
  }

  reset() {
    this.startTime = Date.now()
  }
}

/**
 * Request logger middleware
 */
export function createRequestLogger() {
  return (method: string, route: string, handler: () => Promise<any>) => {
    const timer = new PerformanceTimer()
    
    return async () => {
      logger.logRequest(method, route)
      
      try {
        const result = await handler()
        logger.logResponse(method, route, 200, timer.duration())
        return result
      } catch (error) {
        logger.error(`${method} ${route}`, error as Error)
        throw error
      }
    }
  }
}
