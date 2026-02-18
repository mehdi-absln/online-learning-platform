import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTestDb, clearDb } from '../helpers/db'
import cartGetHandler from '../../server/api/cart/index.get'
import cartPostHandler from '../../server/api/cart/index.post'
import cartDeleteHandler from '../../server/api/cart/[courseId].delete'
import cartMergeHandler from '../../server/api/cart/merge.post'
import { courses, instructors, users, cartItems, enrollments } from '../../server/db/schema'

import { readBody } from 'h3'
import { requireAuth } from '../../server/utils/auth-helpers'

vi.hoisted(() => {
  const handlerStub = (fn: any) => fn
  // @ts-ignore
  globalThis.defineEventHandler = handlerStub
  // @ts-ignore
  globalThis.readBody = vi.fn()
  // @ts-ignore
  globalThis.createError = vi.fn((err: any) => {
    const error = new Error(err.statusMessage || err.message)
    ;(error as any).statusCode = err.statusCode
    ;(error as any).statusMessage = err.statusMessage
    return error
  })
  // @ts-ignore
  globalThis.getRouterParam = vi.fn()
})

// Mock h3 and auth-helpers
vi.mock('h3', async () => {
  const actual = await vi.importActual('h3') as any
  return {
    ...actual,
    readBody: globalThis.readBody,
    createError: globalThis.createError,
    defineEventHandler: globalThis.defineEventHandler,
    getRouterParam: globalThis.getRouterParam,
  }
})

vi.mock('../../server/utils/auth-helpers', () => ({
  requireAuth: vi.fn(),
}))

describe('Cart API Handlers', () => {
  let db: any
  let testUser: any
  let testCourse: any

  beforeEach(async () => {
    const setup = await setupTestDb()
    db = setup.db

    // Seed test data
    const [user] = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    testUser = user

    const [instructor] = await db.insert(instructors).values({
      name: 'John Doe',
      createdAt: new Date(),
    }).returning()

    const [course] = await db.insert(courses).values({
      title: 'Vue Mastery',
      slug: 'vue-mastery',
      price: 100,
      instructorId: instructor.id,
      isPublished: true,
      category: 'Development',
      level: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    testCourse = course

    // Default mock: authenticated user
    vi.mocked(requireAuth).mockResolvedValue(testUser)
  })

  afterEach(async () => {
    await clearDb()
    vi.clearAllMocks()
  })

  describe('GET /api/cart', () => {
    it('should return empty cart initially', async () => {
      const event = {} as any
      const result = await cartGetHandler(event)
      expect(result.success).toBe(true)
      expect(result.data.items).toHaveLength(0)
      expect(result.data.totalPrice).toBe(0)
    })

    it('should return items in cart', async () => {
      await db.insert(cartItems).values({
        userId: testUser.id,
        courseId: testCourse.id,
        createdAt: new Date(),
      })

      const event = {} as any
      const result = await cartGetHandler(event)
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].title).toBe('Vue Mastery')
      expect(result.data.totalPrice).toBe(100)
    })
  })

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      vi.mocked(readBody).mockResolvedValue({ courseId: testCourse.id })
      const event = {} as any
      const result = await cartPostHandler(event)

      expect(result.success).toBe(true)
      const itemsInDb = await db.select().from(cartItems)
      expect(itemsInDb).toHaveLength(1)
    })

    it('should handle item already in cart', async () => {
      await db.insert(cartItems).values({
        userId: testUser.id,
        courseId: testCourse.id,
        createdAt: new Date(),
      })

      vi.mocked(readBody).mockResolvedValue({ courseId: testCourse.id })
      const event = {} as any
      const result = await cartPostHandler(event)

      expect(result.success).toBe(true)
      expect(result.data.message).toBe('Item already in cart')
    })

    it('should error if course is unpublished', async () => {
      const [unpublished] = await db.insert(courses).values({
        title: 'Draft',
        slug: 'draft',
        price: 50,
        isPublished: false,
        instructorId: testCourse.instructorId, // Use a valid instructor ID
        category: 'Development',
        level: 'Beginner',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning()

      vi.mocked(readBody).mockResolvedValue({ courseId: unpublished.id })
      const event = {} as any
      const result = await cartPostHandler(event)

      expect(result.success).toBe(false)
      expect(result.message).toBe('This course is not currently available')
    })

    it('should error if user already enrolled', async () => {
      await db.insert(enrollments).values({
        userId: testUser.id,
        courseId: testCourse.id,
        enrolledAt: new Date(),
      })

      vi.mocked(readBody).mockResolvedValue({ courseId: testCourse.id })
      const event = {} as any
      const result = await cartPostHandler(event)

      expect(result.success).toBe(false)
      expect(result.message).toBe('You are already enrolled in this course')
    })
  })

  describe('DELETE /api/cart/:courseId', () => {
    it('should remove item from cart', async () => {
      await db.insert(cartItems).values({
        userId: testUser.id,
        courseId: testCourse.id,
        createdAt: new Date(),
      })

      vi.mocked(getRouterParam).mockReturnValue(testCourse.id.toString())
      const event = { context: { params: { courseId: testCourse.id.toString() } } } as any
      const result = await cartDeleteHandler(event)

      expect(result.success).toBe(true)
      const itemsInDb = await db.select().from(cartItems)
      expect(itemsInDb).toHaveLength(0)
    })
  })

  describe('POST /api/cart/merge', () => {
    it('should merge bulk items into cart', async () => {
      const [course2] = await db.insert(courses).values({
        title: 'Nuxt 3',
        slug: 'nuxt-3',
        price: 120,
        isPublished: true,
        instructorId: testCourse.instructorId, // Use valid ID
        category: 'Development',
        level: 'Intermediate',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning()

      vi.mocked(readBody).mockResolvedValue({ courseIds: [testCourse.id, course2.id] })
      const event = {} as any
      const result = await cartMergeHandler(event)

      expect(result.success).toBe(true)
      const itemsInDb = await db.select().from(cartItems)
      expect(itemsInDb).toHaveLength(2)
    })
  })
})
