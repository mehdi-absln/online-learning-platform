import { H3Event } from 'h3'
import { verifyToken } from './jwt'
import { db } from '../db/index'
import { users, enrollments } from '../db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Get user from cookie if authenticated (doesn't throw if not logged in)
 * Returns null if no valid token
 */
export async function getOptionalUser(event: H3Event) {
  try {
    const token = getCookie(event, 'accessToken')
    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.userId) {
      return null
    }

    const [user] = await db
      .select({ id: users.id, email: users.email, username: users.username, role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    return user || null
  }
  catch {
    // Token invalid or any error - just return null (not authenticated)
    return null
  }
}

/**
 * Check if user is enrolled in a course
 */
export async function checkEnrollment(userId: number, courseId: number): Promise<boolean> {
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

/**
 * Check if user has access to a lesson
 * Returns true if:
 * - Lesson is free (isFree = true), OR
 * - User is enrolled in the course
 */
export async function hasLessonAccess(
  userId: number | null,
  courseId: number,
  isFree: boolean,
): Promise<boolean> {
  // Free lessons are accessible to everyone
  if (isFree) {
    return true
  }

  // Paid lessons require enrollment
  if (!userId) {
    return false
  }

  return await checkEnrollment(userId, courseId)
}
