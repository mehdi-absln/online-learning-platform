import { ZodError } from 'zod'
import { findByUsernameOrEmail, verifyPassword } from '../../db/user-service'
import { generateToken, generateRefreshToken } from '../../utils/jwt'
import { AUTH_ERRORS } from '../../../app/constants'
import { signInSchema } from '../../../app/schemas/auth'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, signInSchema.parse)

    const { username, password, rememberMe } = body

    // Find user by username or email
    const user = await findByUsernameOrEmail(username)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
      })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

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

    const accessToken = await generateToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    }

    setCookie(event, 'accessToken', accessToken, cookieOptions)
    setCookie(event, 'refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return successResponse(AUTH_ERRORS.SIGNIN_SUCCESS, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ?? 'student',
      },
    })
  }
  catch (error: unknown) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0]
      return errorResponse(firstIssue?.message || 'Validation failed', 'Invalid input')
    }

    // Check if the error has a statusCode property (Nuxt/H3 error)
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string, message?: string }
      return errorResponse(nuxtError.statusMessage || 'An error occurred', nuxtError.message)
    }

    console.error('Sign in error:', error)
    const message = error instanceof Error ? error.message : undefined
    return errorResponse('Internal server error', message)
  }
})
