import { eq, and } from 'drizzle-orm'
import { db } from './index'
import { cartItems, courses, instructors, enrollments } from './schema'

export async function getCartItems(userId: number) {
  return await db
    .select({
      id: courses.id,
      title: courses.title,
      price: courses.price,
      thumbnail: courses.thumbnail,
      slug: courses.slug,
      instructor: {
        name: instructors.name,
      },
      isPublished: courses.isPublished,
    })
    .from(cartItems)
    .innerJoin(courses, eq(cartItems.courseId, courses.id))
    .leftJoin(instructors, eq(courses.instructorId, instructors.id))
    .where(eq(cartItems.userId, userId))
}

export async function addToCart(userId: number, courseId: number) {
  // 1. Check if course exists and is published
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)
    .then(res => res[0])

  if (!course) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    })
  }

  if (!course.isPublished) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This course is not currently available',
    })
  }

  // 2. Check if user is already enrolled
  const existingEnrollment = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
      ),
    )
    .limit(1)
    .then(res => res[0])

  if (existingEnrollment) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You are already enrolled in this course',
    })
  }

  // 3. Add to cart (Unique constraint handled by DB if we miss a race condition)
  try {
    const [newItem] = await db
      .insert(cartItems)
      .values({
        userId,
        courseId,
        createdAt: new Date(),
      })
      .returning()

    return newItem
  }
  catch (error: unknown) {
    const err = error as { code?: string, message?: string }
    if (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE'))) {
      return { message: 'Item already in cart' }
    }
    throw error
  }
}

export async function removeFromCart(userId: number, courseId: number) {
  return await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.courseId, courseId),
      ),
    )
}

export async function bulkAddToCart(userId: number, courseIds: number[]) {
  const results = []
  for (const courseId of courseIds) {
    try {
      const result = await addToCart(userId, courseId)
      results.push({ courseId, success: true, result })
    }
    catch (error: unknown) {
      const err = error as { statusMessage?: string }
      results.push({ courseId, success: false, message: err.statusMessage || 'Failed to add' })
    }
  }
  return results
}

export async function clearCart(userId: number) {
  return await db
    .delete(cartItems)
    .where(eq(cartItems.userId, userId))
}
