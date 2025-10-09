import { UserService } from './server/db/user-service'

async function seed() {
  try {
    // Create a test user
    const testUser = await UserService.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    console.log('Test user created:', testUser)
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
}

export { seed }
