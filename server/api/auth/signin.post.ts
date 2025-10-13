import { UserService } from '../../db/user-service'
import { JWTService } from '../../utils/jwt'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { username, password, rememberMe } = body

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required'
      })
    }

    // Find user by username or email
    const user = await UserService.findByUsernameOrEmail(username)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Verify password
    const isPasswordValid = await UserService.verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email
    }

    const accessToken = await JWTService.generateToken(tokenPayload)
    const refreshToken = await JWTService.generateRefreshToken(tokenPayload)

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
    }

    setCookie(event, 'accessToken', accessToken, cookieOptions)
    setCookie(event, 'refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // Always 30 days for refresh token
    })

    return successResponse('Sign in successful', {
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

    console.error('Sign in error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
