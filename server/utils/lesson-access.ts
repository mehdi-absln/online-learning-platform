import type { H3Event } from 'h3'
import { verifyToken } from './jwt'
import { db } from '../db/index'
import { users, enrollments, instructors, courses } from '../db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Get user from cookie if authenticated (doesn't throw if not logged in)
 */
export async function getOptionalUser(event: H3Event) {
  try {
    const token = getCookie(event, 'accessToken')
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload || !payload.userId) return null

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    return user || null
  }
  catch {
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
 * Check if user is the owner instructor of this course
 * Uses two queries to handle the users → instructors → courses chain
 */
export async function checkIsInstructorOwner(userId: number, courseId: number): Promise<boolean> {
  // 1. Get course instructorId
  const [course] = await db
    .select({ instructorId: courses.instructorId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)

  if (!course?.instructorId) return false

  // 2. Check if instructor.userId matches the current user
  const [instructor] = await db
    .select({ id: instructors.id })
    .from(instructors)
    .where(
      and(
        eq(instructors.id, course.instructorId),
        eq(instructors.userId, userId),
      ),
    )
    .limit(1)

  return !!instructor
}

/**
 * Check if user has access to a lesson
 * Access is granted if:
 * - Lesson is free (isFree = true), OR
 * - User is admin or superadmin, OR
 * - User is enrolled in the course, OR
 * - User is the instructor owner of the course
 */
export async function hasLessonAccess(
  user: { id: number, role: string } | null,
  courseId: number,
  isFree: boolean,
): Promise<boolean> {
  // Free lessons are accessible to everyone
  if (isFree) return true

  // Unauthenticated users cannot access paid lessons
  if (!user) return false

  // Admin and superadmin have full access
  if (user.role === 'admin' || user.role === 'superadmin') return true

  // Check enrollment for all authenticated users
  const enrolled = await checkEnrollment(user.id, courseId)
  if (enrolled) return true

  // Instructor can access their own course lessons
  if (user.role === 'instructor') {
    return await checkIsInstructorOwner(user.id, courseId)
  }

  return false
}
