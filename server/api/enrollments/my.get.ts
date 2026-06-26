import { requireAuth } from '../../utils/auth-helpers'
import { db } from '../../db/index'
import { enrollments } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user - requires accessToken cookie
    const user = await requireAuth(event)

    // Fetch all enrolled course IDs for this user
    const enrolled = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, user.id))

    // Return array of course IDs: [1, 5, 22, ...]
    return successResponse('Enrollments retrieved successfully', {
      courseIds: enrolled.map(e => e.courseId),
    })
  }
  catch (error: unknown) {
    const err = error as { statusMessage?: string, message?: string }
    return errorResponse(err.statusMessage || 'Failed to fetch enrollments', err.message)
  }
})
