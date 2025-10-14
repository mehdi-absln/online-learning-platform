import { UserService } from '../../db/user-service'
import { AUTH_ERRORS } from '../../../app/types/auth-errors'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { username, email, password, confirmPassword, termsAccepted } = body

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.ALL_FIELDS_REQUIRED
      })
    }

    if (password !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.PASSWORDS_DONT_MATCH
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.PASSWORD_TOO_SHORT
      })
    }
    
    // Validate password complexity: at least one uppercase, one lowercase, and one number
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.PASSWORD_TOO_WEAK
      })
    }

    if (!termsAccepted) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.TERMS_NOT_ACCEPTED
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: AUTH_ERRORS.EMAIL_INVALID
      })
    }

    // Check if user already exists
    const existingUser = await UserService.findByUsernameOrEmail(username)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS
      })
    }

    // Create new user
    const newUser = await UserService.createUser({
      username,
      email,
      password
    })

    return successResponse(AUTH_ERRORS.ACCOUNT_CREATED_SUCCESS, {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage || 'An error occurred', error.message)
    }

    console.error('Sign up error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
