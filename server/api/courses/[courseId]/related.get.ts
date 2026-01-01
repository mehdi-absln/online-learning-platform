import { getRelatedCourses } from '~~/server/utils/related-courses'

export default cachedEventHandler(
  async (event) => {
    const courseId = getRouterParam(event, 'courseId')

    if (!courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course ID is required',
      })
    }

    const numericCourseId = parseInt(courseId, 10)

    if (isNaN(numericCourseId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Course ID',
      })
    }

    try {
      const result = await getRelatedCourses({
        courseId: numericCourseId,
        limit: 4,
      })

      // Data is already formatted correctly from related-courses.ts
      return {
        success: result.success,
        data: result.data,
        meta: result.meta,
      }
    } catch (error: any) {
      if (error.message === 'Course not found') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Course not found',
        })
      }

      console.error('Error fetching related courses:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch related courses',
      })
    }
  },
  {
    maxAge: 60 * 15,
    getKey: (event) => {
      const courseId = getRouterParam(event, 'courseId')
      return `related-courses-${courseId}`
    },
  }
)