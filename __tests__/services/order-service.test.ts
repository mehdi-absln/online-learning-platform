import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../../server/db'
import {
  processCheckout,
  getOrderDetails,
  getUserOrders,
  isUserEnrolled,
} from '../../server/db/order-service'
import { setupTestDb, clearDb } from '../helpers/db'
import { eq } from 'drizzle-orm'
import { users, courses, instructors, cartItems, orders } from '../../server/db/schema'

describe('Order Service', () => {
  let testUser: any
  let testCourse: any

  beforeEach(async () => {
    await setupTestDb()
    await clearDb()

    const [user] = await db.insert(users).values({
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

    const [course] = await db.insert(courses).values({
      title: 'Test Course',
      slug: 'test-course',
      price: 100,
      instructorId: instructor.id,
      isPublished: true,
      categoryId: null,
      level: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    testCourse = course

    // Put item in cart
    await db.insert(cartItems).values({
      userId: testUser.id,
      courseId: testCourse.id,
      createdAt: new Date(),
    })
  })

  it('should process a successful checkout', async () => {
    const result = await processCheckout(testUser.id, 'success')
    expect(result.success).toBe(true)
    expect(result.orderId).toBeDefined()

    // Verify order record
    const [order] = await db.select().from(orders).where(eq(orders.id, result.orderId))
    expect(order.status).toBe('completed')
    expect(order.totalAmount).toBe(100)

    // Verify enrollment
    const enrolled = await isUserEnrolled(testUser.id, testCourse.id)
    expect(enrolled).toBe(true)

    // Verify cart is cleared
    const cart = await db.select().from(cartItems).where(eq(cartItems.userId, testUser.id))
    expect(cart).toHaveLength(0)
  })

  it('should process a failed checkout', async () => {
    const result = await processCheckout(testUser.id, 'fail')
    expect(result.success).toBe(false)
    expect(result.orderId).toBeDefined()

    // Verify order record
    const [order] = await db.select().from(orders).where(eq(orders.id, result.orderId))
    expect(order.status).toBe('failed')

    // Verify NO enrollment
    const enrolled = await isUserEnrolled(testUser.id, testCourse.id)
    expect(enrolled).toBe(false)

    // Verify cart is NOT cleared
    const cart = await db.select().from(cartItems).where(eq(cartItems.userId, testUser.id))
    expect(cart).toHaveLength(1)
  })

  it('should throw error if cart is empty', async () => {
    await db.delete(cartItems).where(eq(cartItems.userId, testUser.id))

    await expect(processCheckout(testUser.id, 'success')).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Cart is empty',
    })
  })

  it('should get order details', async () => {
    const checkout = await processCheckout(testUser.id, 'success')
    const details = await getOrderDetails(checkout.orderId, testUser.id)

    expect(details).not.toBeNull()
    expect(details?.id).toBe(checkout.orderId)
    expect(details?.items).toHaveLength(1)
    expect(details?.items[0].title).toBe('Test Course')
  })

  it('should return null for non-existent order or wrong user', async () => {
    const details = await getOrderDetails(999, testUser.id)
    expect(details).toBeNull()
  })

  it('should get all user orders', async () => {
    await processCheckout(testUser.id, 'success')
    const ordersList = await getUserOrders(testUser.id)
    expect(ordersList).toHaveLength(1)
  })
})
