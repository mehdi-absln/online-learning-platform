import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTestDb, clearDb } from '../helpers/db'
import checkoutHandler from '../../server/api/checkout/index.post'
import { courses, instructors, users, cartItems, orders, enrollments } from '../../server/db/schema'

import { readBody } from 'h3'

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
})

// Mock h3
vi.mock('h3', async () => {
  const actual = await vi.importActual('h3') as any
  return {
    ...actual,
    readBody: globalThis.readBody,
    createError: globalThis.createError,
    defineEventHandler: globalThis.defineEventHandler,
  }
})

describe('Checkout API Handlers', () => {
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

    // Add to cart
    await db.insert(cartItems).values({
      userId: testUser.id,
      courseId: testCourse.id,
      createdAt: new Date(),
    })
  })

  afterEach(async () => {
    await clearDb()
    vi.clearAllMocks()
  })

  it('POST /api/checkout should create order and enroll user (success simulation)', async () => {
    vi.mocked(readBody).mockResolvedValue({ simulationType: 'success' })
    const event = { context: { user: testUser } } as any

    const result = await checkoutHandler(event)

    expect(result.success).toBe(true)
    expect(result.orderId).toBeDefined()

    // Verify DB state
    const ordersInDb = await db.select().from(orders)
    expect(ordersInDb).toHaveLength(1)
    expect(ordersInDb[0].status).toBe('completed')

    const enrollmentsInDb = await db.select().from(enrollments)
    expect(enrollmentsInDb).toHaveLength(1)

    const cartInDb = await db.select().from(cartItems)
    expect(cartInDb).toHaveLength(0)
  })

  it('POST /api/checkout should create failed order but not enroll or clear cart (fail simulation)', async () => {
    vi.mocked(readBody).mockResolvedValue({ simulationType: 'fail' })
    const event = { context: { user: testUser } } as any

    const result = await checkoutHandler(event)

    expect(result.success).toBe(false)
    expect(result.orderId).toBeDefined()

    // Verify DB state
    const ordersInDb = await db.select().from(orders)
    expect(ordersInDb).toHaveLength(1)
    expect(ordersInDb[0].status).toBe('failed')

    const enrollmentsInDb = await db.select().from(enrollments)
    expect(enrollmentsInDb).toHaveLength(0)

    const cartInDb = await db.select().from(cartItems)
    expect(cartInDb).toHaveLength(1)
  })

  it('POST /api/checkout should return 401 if unauthorized', async () => {
    const event = { context: { user: null } } as any
    await expect(checkoutHandler(event)).rejects.toThrow('Unauthorized')
  })

  it('POST /api/checkout should rollback transaction if an error occurs mid-process', async () => {
    // We force a failure during enrollment step by mocking the transaction or using a constraint
    // But we want to verify that previously inserted Order is rolled back.

    // Inject a failure by making enrollments table "unwritable" or similar
    // Actually, we can just spy on the transaction if we were using a separate service,
    // but here it's in order-service.ts.

    // We'll use a more direct way: Mock the db.insert for enrollments to throw.
    const originalTransaction = db.transaction
    // @ts-ignore
    db.transaction = vi.fn().mockImplementation((cb: any) => {
      return originalTransaction.call(db, (tx: any) => {
        const originalInsert = tx.insert
        tx.insert = vi.fn().mockImplementation((table: any) => {
          if (table === enrollments) {
            throw new Error('Mid-Checkout Failure')
          }
          return originalInsert.call(tx, table)
        })
        return cb(tx)
      })
    })

    vi.mocked(readBody).mockResolvedValue({ simulationType: 'success' })
    const event = { context: { user: testUser } } as any

    await expect(checkoutHandler(event)).rejects.toThrow('Mid-Checkout Failure')

    // Restore original transaction
    db.transaction = originalTransaction

    // Verify Rollback: Nothing should be in DB except seeded data
    const ordersInDb = await db.select().from(orders)
    expect(ordersInDb).toHaveLength(0) // Should be rolled back!

    const enrollmentsInDb = await db.select().from(enrollments)
    expect(enrollmentsInDb).toHaveLength(0)

    const cartInDb = await db.select().from(cartItems)
    expect(cartInDb).toHaveLength(1) // Cart should NOT be cleared
  })
})
