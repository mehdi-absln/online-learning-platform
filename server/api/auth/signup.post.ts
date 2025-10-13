import { UserService } from '../../db/user-service'
import { errorResponse, successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { username, email, password, confirmPassword, termsAccepted } = body

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required'
      })
    }

    if (password !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Passwords do not match'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    if (!termsAccepted) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You must accept the terms and conditions'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please enter a valid email address'
      })
    }

    // Check if user already exists
    const existingUser = await UserService.findByUsernameOrEmail(username)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username or email already exists'
      })
    }

    // Create new user
    const newUser = await UserService.createUser({
      username,
      email,
      password
    })

    return successResponse('Account created successfully', {
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
