import { eq, desc, inArray, and } from 'drizzle-orm'
import { db } from './index'
import { orders, orderItems, enrollments, cartItems, courses, instructors as instructorsTable } from './schema'

export async function processCheckout(userId: number, simulationType: 'success' | 'fail'): Promise<{ success: boolean, orderId: number }> {
  if (simulationType === 'fail') {
    return db.transaction(async (tx) => {
      const userCartItems = await tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId))
        .all()

      if (userCartItems.length === 0) {
        throw { statusCode: 400, statusMessage: 'Cart is empty' }
      }

      const courseIds = userCartItems.map(item => item.courseId)
      const dbCourses = await tx
        .select({ price: courses.price })
        .from(courses)
        .where(inArray(courses.id, courseIds))
        .all()

      const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

      const insertedOrders = await tx
        .insert(orders)
        .values({
          userId,
          totalAmount,
          status: 'failed',
          createdAt: new Date(),
        })
        .returning()
        .all()

      const failedOrder = insertedOrders[0]
      if (!failedOrder) {
        throw { statusCode: 500, statusMessage: 'Failed to create order' }
      }

      return { success: false, orderId: failedOrder.id }
    })
  }

  return db.transaction(async (tx) => {
    const userCartItems = await tx
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
    const dbCourses = await tx
      .select({ id: courses.id, price: courses.price })
      .from(courses)
      .where(inArray(courses.id, courseIds))
      .all()

    // Check if user is instructor of any course in cart
    const ownedCourses = await tx
      .select({ courseId: courses.id })
      .from(courses)
      .innerJoin(instructorsTable, eq(courses.instructorId, instructorsTable.id))
      .where(
        and(
          inArray(courses.id, courseIds),
          eq(instructorsTable.userId, userId),
        ),
      )
      .all()

    if (ownedCourses.length > 0) {
      throw {
        statusCode: 403,
        statusMessage: 'Your cart contains a course you own. Please remove it before checkout.',
      }
    }

    const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

    const insertedOrders = await tx
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

    const newOrder = insertedOrders[0]
    if (!newOrder) {
      throw { statusCode: 500, statusMessage: 'Failed to create order' }
    }

    for (const course of dbCourses) {
      await tx.insert(orderItems).values({
        orderId: newOrder.id,
        courseId: course.id,
        price: course.price,
      }).run()

      await tx.insert(enrollments).values({
        userId,
        courseId: course.id,
        orderId: newOrder.id,
        enrolledAt: new Date(),
      }).run()
    }

    await tx.delete(cartItems).where(eq(cartItems.userId, userId)).run()

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

  const firstRow = result[0]!
  return {
    id: firstRow.id,
    totalAmount: firstRow.totalAmount,
    status: firstRow.status,
    createdAt: firstRow.createdAt,
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
