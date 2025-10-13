import { JWTService } from '../../utils/jwt'
import { UserService } from '../../db/user-service'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const accessToken = getCookie(event, 'accessToken')

    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No access token provided'
      })
    }

    // Verify token
    const payload = await JWTService.verifyToken(accessToken)

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid access token'
      })
    }

    // Get user details
    const user = await UserService.findById(payload.userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    return successResponse('User retrieved successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage || 'An error occurred', error.message)
    }

    console.error('Get current user error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
