import { H3Event } from 'h3'
import { getCourseById, getCourseLessons } from '../../db/course-service'
import { getRouterParam, setResponseStatus } from 'h3'
import { transformCourseForClient } from '../../utils/course-transformer'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching course by ID...')
    const id = Number(getRouterParam(event, 'id'))
    console.log('Course ID:', id)
    
    if (isNaN(id) || id <= 0) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course ID',
      }
    }
    
    const course = await getCourseById(id)
    
    if (!course) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }
    
    const transformedCourse = transformCourseForClient(course)
    
    // Get lessons for this course
    const lessons = await getCourseLessons(id)
    
    return {
      success: true,
      data: {
        ...transformedCourse,
        lessons: lessons.map(lesson => lesson.title), // Just return lesson titles for now
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