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

    // مربی فقط دورهٔ خودش را می‌تواند ویرایش کند
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

    // مربی اجازه ندارد instructorId را تغییر دهد
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
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Update Course Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
