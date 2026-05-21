import { db } from '../../../db'
import { courses, instructors } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { requireInstructor } from '../../../utils/auth-helpers'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireInstructor(event) // ✅ هم ادمین هم مربی

    const body = await readBody(event)
    const { title, slug, description, price, isPublished } = body

    // اگر کاربر نقش مربی دارد، شناسهٔ مدرسِ او را از جدول instructors پیدا کن
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
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Create Course Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
