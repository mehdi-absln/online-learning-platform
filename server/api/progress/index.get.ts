import { verifyToken } from '../../utils/jwt'
import { getProgressByUserId } from '../../db/progress-service'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'accessToken')

    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated',
      })
    }

    const payload = await verifyToken(accessToken)

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      })
    }

    const progress = await getProgressByUserId(payload.userId)

    return successResponse('Progress retrieved successfully', { progress })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string }
      throw createError({
        statusCode: nuxtError.statusCode || 500,
        statusMessage: nuxtError.statusMessage || 'An error occurred',
      })
    }

    console.error('Get progress error:', error)
    return errorResponse('Internal server error', (error as Error).message)
  }
})