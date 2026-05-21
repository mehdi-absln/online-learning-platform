import { db } from '../../../db'
import { courses, instructors } from '../../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { verifyToken } from '../../../utils/jwt'
import { findById } from '../../../db/user-service'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'accessToken')
    if (!accessToken) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const payload = await verifyToken(accessToken)
    if (!payload) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const user = await findById(payload.userId)
    if (
      !user
      || (user.role !== 'admin'
        && user.role !== 'ADMIN'
        && user.role !== 'superadmin'
        && user.role !== 'instructor')
    ) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    // اگر کاربر فقط مدرّس است، دوره‌های خودش را برگردان
    if (user.role === 'instructor') {
      const [instructor] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.userId, user.id))
        .limit(1)

      if (!instructor) {
        return successResponse('Courses retrieved', [])
      }

      const ownCourses = await db.query.courses.findMany({
        where: eq(courses.instructorId, instructor.id),
        orderBy: [desc(courses.createdAt)],
      })

      return successResponse('Courses retrieved', ownCourses)
    }

    // در غیر این صورت (admin, superadmin) همهٔ دوره‌ها
    const allCourses = await db.query.courses.findMany({
      orderBy: [desc(courses.createdAt)],
    })

    return successResponse('Courses retrieved', allCourses)
  }
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Admin Fetch Courses Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
