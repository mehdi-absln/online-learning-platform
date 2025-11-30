import type { ApiResponse, ValidationError, ValidationErrorResponse } from '~/types/shared/api'

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data
})

export const successAuthResponse = <T>(message: string, user: T): ApiResponse<T> => ({
  success: true,
  message,
  user
})

export const errorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error
})

export const validationErrorResponse = (
  message: string,
  errors: ValidationError[]
): ValidationErrorResponse => ({
  success: false,
  message,
  errors
})
