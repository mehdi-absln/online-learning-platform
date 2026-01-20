import { verifyToken } from '../../utils/jwt'
import { saveNotes } from '../../db/progress-service'
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
    const { lessonId, notes } = body

    if (!lessonId || typeof lessonId !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Lesson ID is required',
      })
    }

    if (typeof notes !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notes must be a string',
      })
    }

    const progress = await saveNotes(payload.userId, lessonId, notes)

    return successResponse('Notes saved', { progress })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string }
      throw createError({
        statusCode: nuxtError.statusCode || 500,
        statusMessage: nuxtError.statusMessage || 'An error occurred',
      })
    }

    console.error('Save notes error:', error)
    return errorResponse('Internal server error', (error as Error).message)
  }
})