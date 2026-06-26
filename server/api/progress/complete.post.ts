import { verifyToken } from '../../utils/jwt'
import { toggleComplete } from '../../db/progress-service'
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

    const body = await readBody(event)
    const { lessonId } = body

    if (!lessonId || typeof lessonId !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Lesson ID is required',
      })
    }

    const progress = await toggleComplete(payload.userId, lessonId)

    return successResponse('Lesson completion toggled', { progress })
  }
  catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string }
      throw createError({
        statusCode: nuxtError.statusCode || 500,
        statusMessage: nuxtError.statusMessage || 'An error occurred',
      })
    }

    return errorResponse('Internal server error', (error as Error).message)
  }
})
