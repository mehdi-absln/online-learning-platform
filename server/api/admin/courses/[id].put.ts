import { setResponseStatus } from 'h3'
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
          statusMessage: 'Forbidden: You can only edit your own courses',
        })
      }
    }

    const body = await readBody(event)
    const { title, slug, description, price, isPublished, instructorId: bodyInstructorId } = body

    if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
      throw createError({ statusCode: 400, statusMessage: 'Description cannot be empty' })
    }

    const finalInstructorId
      = user.role === 'admin' ? (bodyInstructorId ?? course.instructorId) : course.instructorId

    await db
      .update(courses)
      .set({
        title: title ?? course.title,
        slug: slug ?? course.slug,
        description: description !== undefined ? description : course.description,
        price: price !== undefined ? price : course.price,
        isPublished: isPublished !== undefined ? isPublished : course.isPublished,
        instructorId: finalInstructorId,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))

    return successResponse('Course updated successfully')
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
