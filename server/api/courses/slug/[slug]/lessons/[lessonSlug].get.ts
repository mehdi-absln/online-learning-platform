import type { H3Event, getRouterParam, setResponseStatus } from 'h3'
import { getDetailedCourseBySlug } from '~~/server/db/course-service'
import { transformCourseForClientWithDetails } from '~~/server/utils/course-transformer'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching detailed course and lesson by slug...')
    const courseSlug = getRouterParam(event, 'slug')
    const lessonSlug = getRouterParam(event, 'lessonSlug')

    console.log('Course slug:', courseSlug)
    console.log('Lesson slug:', lessonSlug)

    if (!courseSlug || !lessonSlug) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course or lesson slug',
      }
    }

    const detailedCourseData = await getDetailedCourseBySlug(courseSlug)

    if (!detailedCourseData) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }

    const { course, learningObjectives, contentSections, reviews, lessons } = detailedCourseData

    // Find the lesson based on the lesson slug
    const lesson = lessons.find(l => l.slug === lessonSlug)

    if (!lesson) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Lesson not found',
      }
    }

    // Transform the course with all additional data
    const transformedCourse = transformCourseForClientWithDetails(
      course,
      learningObjectives,
      contentSections,
      reviews,
      lessons,
    )

    // Return course data along with lesson ID
    return {
      success: true,
      data: {
        ...transformedCourse,
      },
      courseId: course.id,
      lessonId: lesson.id,
    }
  }
  catch (error: unknown) {
    console.error(`Detailed error in GET /api/courses/slug/[slug]/lessons/[lessonSlug]:`, error)
    console.error('Error name:', (error as Error).name)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch course or lesson',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
