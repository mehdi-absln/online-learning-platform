import { eq, desc, inArray, and } from 'drizzle-orm'
import { db } from './index'
import { orders, orderItems, enrollments, cartItems, courses } from './schema'

export async function processCheckout(userId: number, simulationType: 'success' | 'fail') {
  if (simulationType === 'fail') {
    return db.transaction((tx) => {
      // 1. Get cart total for the failed order record
      const userCartItems = tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId))
        .all()

      if (userCartItems.length === 0) {
        throw { statusCode: 400, statusMessage: 'Cart is empty' }
      }

      const courseIds = userCartItems.map(item => item.courseId)
      const dbCourses = tx
        .select({ price: courses.price })
        .from(courses)
        .where(inArray(courses.id, courseIds))
        .all()

      const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

      // 2. Create a FAILED order
      const [failedOrder] = tx
        .insert(orders)
        .values({
          userId,
          totalAmount,
          status: 'failed',
          createdAt: new Date(),
        })
        .returning()
        .all()

      // We do NOT enroll or clear cart on failure
      return { success: false, orderId: failedOrder.id }
    })
  }

  // Success simulation
  return db.transaction((tx) => {
    const userCartItems = tx
      .select({ courseId: cartItems.courseId })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .all()

    if (userCartItems.length === 0) {
      throw {
        statusCode: 400,
        statusMessage: 'Cart is empty',
      }
    }

    const courseIds = userCartItems.map(item => item.courseId)
    const dbCourses = tx
      .select({ id: courses.id, price: courses.price })
      .from(courses)
      .where(inArray(courses.id, courseIds))
      .all()

    const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

    const [newOrder] = tx
      .insert(orders)
      .values({
        userId,
        totalAmount,
        status: 'completed',
        completedAt: new Date(),
        createdAt: new Date(),
      })
      .returning()
      .all()

    for (const course of dbCourses) {
      tx.insert(orderItems).values({
        orderId: newOrder.id,
        courseId: course.id,
        price: course.price,
      }).run()

      tx.insert(enrollments).values({
        userId,
        courseId: course.id,
        orderId: newOrder.id,
        enrolledAt: new Date(),
      }).run()
    }

    tx.delete(cartItems).where(eq(cartItems.userId, userId)).run()

    return { success: true, orderId: newOrder.id }
  })
}

export async function getOrderDetails(orderId: number, userId: number) {
  const result = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      items: {
        id: courses.id,
        title: courses.title,
        price: orderItems.price,
        thumbnail: courses.thumbnail,
      },
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(courses, eq(orderItems.courseId, courses.id))
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.userId, userId),
      ),
    )

  if (!result.length) return null

  return {
    id: result[0].id,
    totalAmount: result[0].totalAmount,
    status: result[0].status,
    createdAt: result[0].createdAt,
    items: result.map(r => r.items),
  }
}

export async function getUserOrders(userId: number) {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

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
