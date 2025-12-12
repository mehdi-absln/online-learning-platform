import { UserService } from '../../db/user-service'
import { JWTService } from '../../utils/jwt'
import { AUTH_ERRORS } from '../../../app/types/auth-errors'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { username, password, rememberMe } = body

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.USERNAME_REQUIRED + ' and ' + AUTH_ERRORS.PASSWORD_REQUIRED,
      })
    }

    // Find user by username or email
    const user = await UserService.findByUsernameOrEmail(username)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
      })
    }

    // Verify password
    const isPasswordValid = await UserService.verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
      })
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    }

    const accessToken = await JWTService.generateToken(tokenPayload)
    const refreshToken = await JWTService.generateRefreshToken(tokenPayload)

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days or 7 days
    }

    setCookie(event, 'accessToken', accessToken, cookieOptions)
    setCookie(event, 'refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // Always 30 days for refresh token
    })

    return successResponse(AUTH_ERRORS.SIGNIN_SUCCESS, {
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

    console.error('Sign in error:', error)
    return errorResponse('Internal server error', (error as Error).message)
  }
})
