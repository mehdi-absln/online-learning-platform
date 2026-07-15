import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db, setupTestDb, clearDb } from '../helpers/db'
import { users, courses, instructors } from '../../server/db/schema'
import {
  getCartItems,
  addToCart,
  removeFromCart,
  bulkAddToCart,
  clearCart,
} from '../../server/db/cart-service'

// ───── Use the in-memory test DB instead of the real Turso client ─────
// server/db/index.ts throws at import time when TURSO_DATABASE_URL is not
// set. The cart-service imports `db` from there, so we alias it to the
// in-memory test database created by setupTestDb().
vi.mock('../../server/db', async () => {
  process.env.NODE_ENV = 'test'
  const dbModule = await import('../helpers/db')
  await dbModule.setupTestDb()
  return { db: dbModule.db }
})

describe('Cart Service', () => {
  let testUser: any
  let testCourse: any
  let testInstructor: any

  beforeEach(async () => {
    await setupTestDb()
    await clearDb()

    // Seed basic data
    const [user] = await db.insert(users).values({
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    testUser = user

    const [instructor] = await db.insert(instructors).values({
      name: 'Test Instructor',
      createdAt: new Date(),
    }).returning()
    testInstructor = instructor

    const [course] = await db.insert(courses).values({
      title: 'Test Course',
      slug: 'test-course',
      description: 'Test description',
      price: 100,
      instructorId: instructor.id,
      isPublished: true,
      categoryId: null, // Optional
      level: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    testCourse = course
  })

  it('should add an item to the cart', async () => {
    const result = await addToCart(testUser.id, testCourse.id)
    expect(result).toBeDefined()
    expect(result.courseId).toBe(testCourse.id)

    const items = await getCartItems(testUser.id)
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe(testCourse.id)
  })

  it('should throw error if course does not exist', async () => {
    await expect(addToCart(testUser.id, 999)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Course not found',
    })
  })

  it('should throw error if course is unpublished', async () => {
    const [draft] = await db.insert(courses).values({
      title: 'Draft',
      slug: 'draft',
      description: 'Draft description',
      price: 50,
      instructorId: testInstructor.id,
      isPublished: false,
      categoryId: null,
      level: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    await expect(addToCart(testUser.id, draft.id)).rejects.toMatchObject({
      statusCode: 403,
      statusMessage: 'This course is not currently available',
    })
  })

  it('should handle duplicate items gracefully', async () => {
    await addToCart(testUser.id, testCourse.id)
    const result = await addToCart(testUser.id, testCourse.id)

    expect(result).toMatchObject({ message: 'Item already in cart' })

    const items = await getCartItems(testUser.id)
    expect(items).toHaveLength(1)
  })

  it('should remove an item from the cart', async () => {
    await addToCart(testUser.id, testCourse.id)
    await removeFromCart(testUser.id, testCourse.id)

    const items = await getCartItems(testUser.id)
    expect(items).toHaveLength(0)
  })

  it('should bulk add items to the cart', async () => {
    const [course2] = await db.insert(courses).values({
      title: 'Course 2',
      slug: 'course-2',
      description: 'Course 2 description',
      price: 200,
      instructorId: testInstructor.id,
      isPublished: true,
      categoryId: null,
      level: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    const results = await bulkAddToCart(testUser.id, [testCourse.id, course2.id])
    expect(results).toHaveLength(2)
    expect(results.every(r => r.success)).toBe(true)

    const items = await getCartItems(testUser.id)
    expect(items).toHaveLength(2)
  })

  it('should clear the cart', async () => {
    await addToCart(testUser.id, testCourse.id)
    await clearCart(testUser.id)

    const items = await getCartItems(testUser.id)
    expect(items).toHaveLength(0)
  })
})
