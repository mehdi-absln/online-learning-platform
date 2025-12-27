import { getRelatedCourses } from '~~/server/utils/related-courses'
import { transformCourseForClient } from '~~/server/utils/course-transformer'

export default cachedEventHandler(
  async (event) => {
    // Get courseId from URL params
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
      // Call the business logic function
      const result = await getRelatedCourses({
        courseId: numericCourseId,
        limit: 4,
      })

      // Transform the result to match the expected API response format
      const formattedData = result.data.map(course => ({
        id: course.id.toString(),
        title: course.title,
        slug: course.slug,
        description: course.description,
        image: course.image || '/images/placeholder-course.svg', // Ensure image is provided
        price: course.price, // Price is already converted in business logic
        level: course.level.toLowerCase(),
        rating: course.rating,
        studentsCount: course.studentCount,
        category: course.category,
        instructor: {
          name: course.instructor.name,
          avatar: course.instructor.avatar,
          id: course.instructor.id
        },
        tags: course.tags || '',
      }))

      return {
        ...result,
        data: formattedData,
        meta: {
          ...result.meta,
          basedOn: {
            categoryId: result.meta.basedOn.category,
            tagIds: result.meta.basedOn.tags
          }
        }
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
    maxAge: 60 * 15, // Cache for 15 minutes
    getKey: (event) => {
      const courseId = getRouterParam(event, 'courseId')
      return `related-courses-${courseId}`
    },
  }
)