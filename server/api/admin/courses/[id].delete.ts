import { db } from '../../../db'
import { courses, instructors } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { requireInstructor } from '../../../utils/auth-helpers'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireInstructor(event)

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
    const courseId = parseInt(id, 10)

    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!course) throw createError({ statusCode: 404, statusMessage: 'Course not found' })

    if (user.role === 'instructor') {
      const [instructor] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.userId, user.id))
        .limit(1)

      if (!instructor || course.instructorId !== instructor.id) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden: You can only delete your own courses',
        })
      }
    }

    await db.delete(courses).where(eq(courses.id, courseId))
    return successResponse('Course deleted successfully')
  }
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Delete Course Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
