import { inArray, eq } from 'drizzle-orm'
import { db } from '../../db'
import { courses, instructors } from '../../db/schema'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return successResponse('No IDs provided', [])
    }

    const result = await db
      .select({
        id: courses.id,
        title: courses.title,
        price: courses.price,
        thumbnail: courses.thumbnail,
        slug: courses.slug,
        instructor: {
          name: instructors.name,
        },
        isPublished: courses.isPublished,
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(inArray(courses.id, ids))

    return successResponse('Courses fetched successfully', result)
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    return errorResponse('Failed to fetch courses', err.message)
  }
})
