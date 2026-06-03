import { findByUsernameOrEmail, createUser } from '../../db/user-service'
import { AUTH_ERRORS } from '../../../app/constants'
import { signUpSchema } from '../../../app/schemas/auth'
import { errorResponse, successResponse } from '../../utils/response'

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
    if (error instanceof Error && error.name === 'ZodError') {
      const firstIssue = (error as any).issues?.[0]
      return errorResponse(firstIssue?.message || 'Validation failed', 'Invalid input')
    }

    // Check if the error has a statusCode property (Nuxt/H3 error)
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string, message?: string }
      return errorResponse(nuxtError.statusMessage || 'An error occurred', nuxtError.message)
    }

    console.error('Sign up error:', error)
    return errorResponse('Internal server error', (error as Error).message)
  }
})
