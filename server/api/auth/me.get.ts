import { verifyToken } from '../../utils/jwt'
import { findById } from '../../db/user-service'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const accessToken = getCookie(event, 'accessToken')

    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No access token provided',
      })
    }

    // Verify token
    const payload = await verifyToken(accessToken)

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid access token',
      })
    }

    // Get user details
    const user = await findById(payload.userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    return successResponse('User retrieved successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  }
  catch (error: unknown) {
    // Check if the error has a statusCode property (Nuxt/H3 error)
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string, message?: string }
      return errorResponse(nuxtError.statusMessage || 'An error occurred', nuxtError.message)
    }

    console.error('Get current user error:', error)
    return errorResponse('Internal server error', (error as Error).message)
  }
})
