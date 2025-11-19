import { H3Event } from 'h3'
import { getDetailedCourseById, getCourseLessons } from '../../db/course-service'
import { getRouterParam, setResponseStatus } from 'h3'
import { transformCourseForClientWithDetails } from '../../utils/course-transformer'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching detailed course by ID...')
    const id = Number(getRouterParam(event, 'id'))
    console.log('Course ID:', id)

    if (isNaN(id) || id <= 0) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course ID',
      }
    }

    const detailedCourseData = await getDetailedCourseById(id)

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
      lessons
    )

    return {
      success: true,
      data: {
        ...transformedCourse,
      },
    }
  } catch (error: unknown) {
    console.error(`Detailed error in GET /api/courses/[id]:`, error)
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