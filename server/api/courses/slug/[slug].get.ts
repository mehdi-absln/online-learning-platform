import { getDetailedCourseBySlug } from '../../../db/course-service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  try {
    const course = await getDetailedCourseBySlug(slug)

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Course not found',
      })
    }

    return {
      success: true,
      data: course,
    }
  }
  catch (error: any) {
    console.error('Error fetching course:', error.message)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course',
    })
  }
})
