import { UserService } from '../db/user-service'

export default defineEventHandler(async (event) => {
  try {
    // Check if test user already exists
    const existingUser = await UserService.findByUsernameOrEmail('testuser')

    if (existingUser) {
      return {
        success: true,
        message: 'Test user already exists',
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email
        }
      }
    }

    // Create test user
    const testUser = await UserService.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    return {
      success: true,
      message: 'Test user created successfully',
      user: {
        id: testUser.id,
        username: testUser.username,
        email: testUser.email
      }
    }
  } catch (error) {
    console.error('Seed error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
