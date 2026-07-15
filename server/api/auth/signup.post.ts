import { ZodError } from 'zod'
import { findByUsernameOrEmail, createUser } from '../../db/user-service'
import { AUTH_ERRORS } from '../../../app/constants'
import { signUpSchema } from '../../../app/schemas/auth'
import { errorResponse, successResponse } from '../../utils/response'
import { generateToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, signUpSchema.parse)

    const { username, email, password } = body

    // Check if user already exists
    const existingUser = await findByUsernameOrEmail(username)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS,
      })
    }

    // Create new user
    const newUser = await createUser({
      username,
      email,
      password,
    })

    // Issue an auth token + cookie so the user is actually logged in after
    // signup. Without this, the Pinia store marks the user authenticated but
    // no accessToken cookie is set, so the next authenticated request (e.g.
    // add to cart) fails with 401 -> "Failed to add item to cart".
    const accessToken = await generateToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    })

    setCookie(event, 'accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return successResponse(AUTH_ERRORS.ACCOUNT_CREATED_SUCCESS, {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role ?? 'student',
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

    const message = error instanceof Error ? error.message : undefined
    return errorResponse('Internal server error', message)
  }
})
