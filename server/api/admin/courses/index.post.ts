import { setResponseStatus } from 'h3'
import { db } from '../../../db'
import { courses, instructors } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { requireInstructor } from '../../../utils/auth-helpers'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireInstructor(event)

    const body = await readBody(event)
    const { title, slug, description, price, isPublished } = body

    let instructorId = null
    if (user.role === 'instructor') {
      const [instructor] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.userId, user.id))
        .limit(1)

      if (!instructor) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instructor profile not found. Ask an admin to assign instructor role properly.',
        })
      }
      instructorId = instructor.id
    }

    const now = new Date()
    const newCourse = await db
      .insert(courses)
      .values({
        title,
        slug,
        description: description || '',
        price: price || 0,
        isPublished: isPublished ?? true,
        instructorId,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return successResponse('Course created successfully', newCourse[0])
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, message?: string }

    if (err.statusCode) {
      setResponseStatus(event, err.statusCode)
      return errorResponse(err.statusMessage || 'Request failed', err.message)
    }

    setResponseStatus(event, 500)
    return errorResponse('Internal server error', err.message || 'Unknown error')
  }
})
