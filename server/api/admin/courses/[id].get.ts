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

    // مربی فقط می‌تواند دورهٔ خودش را ببیند
    if (user.role === 'instructor') {
      const [instructor] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.userId, user.id))
        .limit(1)

      if (!instructor || course.instructorId !== instructor.id) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden: You can only view your own courses',
        })
      }
    }

    return successResponse('Course retrieved', course)
  }
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Get Course Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
