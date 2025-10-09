import { JWTService } from '../../utils/jwt'
import { UserService } from '../../db/user-service'

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

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get current user error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
