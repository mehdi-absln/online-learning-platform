import type { H3Event } from 'h3'
import { getRouterParam, setResponseStatus } from 'h3'
import { getDetailedCourseBySlug } from '../../../db/course-service'
import { transformCourseForClientWithDetails } from '../../../utils/course-transformer'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching detailed course by slug...')
    const slug = getRouterParam(event, 'slug')
    console.log('Course slug:', slug)

    if (!slug) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course slug',
      }
    }

    const detailedCourseData = await getDetailedCourseBySlug(slug)

    if (!detailedCourseData) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }

    const { course, learningObjectives, contentSections, reviews, lessons } = detailedCourseData

    // Transform the course with all additional data
    const transformedCourse = transformCourseForClientWithDetails(
      course,
      learningObjectives,
      contentSections,
      reviews,
      lessons,
    )

    return {
      success: true,
      data: {
        ...transformedCourse,
      },
      courseId: course.id,
    }
  }
  catch (error: unknown) {
    console.error(`Detailed error in GET /api/courses/slug/[slug]:`, error)
    console.error('Error name:', (error as Error).name)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch course',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
