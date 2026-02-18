import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTestDb, clearDb } from '../helpers/db'
import orderDetailsHandler from '../../server/api/orders/[id].get'
import { courses, instructors, users, orders, orderItems } from '../../server/db/schema'

import { getRouterParam } from 'h3'

vi.hoisted(() => {
  const handlerStub = (fn: any) => fn
  // @ts-ignore
  globalThis.defineEventHandler = handlerStub
  // @ts-ignore
  globalThis.getRouterParam = vi.fn()
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
    getRouterParam: globalThis.getRouterParam,
    createError: globalThis.createError,
    defineEventHandler: globalThis.defineEventHandler,
  }
})

describe('Orders API Handlers', () => {
  let db: any
  let testUser: any
  let testOrder: any

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

    const [order] = await db.insert(orders).values({
      userId: testUser.id,
      totalAmount: 100,
      status: 'completed',
      createdAt: new Date(),
    }).returning()
    testOrder = order

    await db.insert(orderItems).values({
      orderId: testOrder.id,
      courseId: course.id,
      price: 100,
    })
  })

  afterEach(async () => {
    await clearDb()
    vi.clearAllMocks()
  })

  it('GET /api/orders/:id should return order details', async () => {
    vi.mocked(getRouterParam).mockReturnValue(testOrder.id.toString())
    const event = { context: { user: testUser } } as any

    const result = await orderDetailsHandler(event)

    expect(result.success).toBe(true)
    expect(result.order.id).toBe(testOrder.id)
    expect(result.order.items).toHaveLength(1)
  })

  it('GET /api/orders/:id should return 400 for invalid ID format', async () => {
    vi.mocked(getRouterParam).mockReturnValue('abc')
    const event = { context: { user: testUser } } as any

    await expect(orderDetailsHandler(event)).rejects.toThrow('Invalid Order ID')
  })

  it('GET /api/orders/:id should return 404 for non-existent order', async () => {
    vi.mocked(getRouterParam).mockReturnValue('999')
    const event = { context: { user: testUser } } as any

    await expect(orderDetailsHandler(event)).rejects.toThrow('Order not found')
  })

  it('GET /api/orders/:id should return 404 if order belongs to another user', async () => {
    const [otherUser] = await db.insert(users).values({
      name: 'Other User',
      email: 'other@test.com',
      password: 'pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    vi.mocked(getRouterParam).mockReturnValue(testOrder.id.toString())
    const event = { context: { user: otherUser } } as any

    await expect(orderDetailsHandler(event)).rejects.toThrow('Order not found')
  })
})
