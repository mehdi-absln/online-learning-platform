import { eq, desc, inArray, and } from 'drizzle-orm'
import { db } from './index'
import { orders, orderItems, enrollments, cartItems, courses } from './schema'

export async function processCheckout(userId: number, paymentRef: string) {
  return await db.transaction(async (tx) => {
    // 1. Get cart items for this user
    const userCartItems = await tx
      .select({
        courseId: cartItems.courseId,
      })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))

    if (userCartItems.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart is empty',
      })
    }

    // 2. Fetch current prices from database (NEVER trust client prices)
    const courseIds = userCartItems.map(item => item.courseId)
    const dbCourses = await tx
      .select({
        id: courses.id,
        price: courses.price,
      })
      .from(courses)
      .where(inArray(courses.id, courseIds))

    // 3. Calculate total amount server-side
    const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

    // 4. Create the order
    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId,
        totalAmount,
        status: 'completed', // Simulated successful payment
        paymentRef,
        completedAt: new Date(),
        createdAt: new Date(),
      })
      .returning()

    // 5. Create order items and enrollments
    for (const course of dbCourses) {
      // Add to order_items
      await tx.insert(orderItems).values({
        orderId: newOrder.id,
        courseId: course.id,
        price: course.price,
      })

      // Add to enrollments
      await tx.insert(enrollments).values({
        userId,
        courseId: course.id,
        orderId: newOrder.id,
        enrolledAt: new Date(),
      })
    }

    // 6. Clear user's cart
    await tx.delete(cartItems).where(eq(cartItems.userId, userId))

    return newOrder
  })
}

export async function getUserOrders(userId: number) {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

// Helper to check enrollment
export async function isUserEnrolled(userId: number, courseId: number) {
  const result = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
      ),
    )
    .limit(1)

  return result.length > 0
}
