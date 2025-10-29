import { H3Event } from 'h3'
import { getAllCourses } from '../../db/course-service'
import { setResponseStatus } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching all courses...')
    const courses = await getAllCourses()
    console.log('Courses fetched successfully:', courses.length)
    
    // Transform the price from cents to dollars for the frontend
    // and add instructor information since the frontend expects it
    const transformedCourses = courses.map(course => ({
      ...course,
      price: course.price / 100, // Convert from cents to dollars
      // Add placeholder instructor information
      instructor: {
        name: 'Instructor Name',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      stats: {
        students: course.studentCount
      }
    }))
    
    return {
      success: true,
      data: transformedCourses,
    }
  } catch (error: any) {
    console.error('Detailed error in GET /api/courses:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch courses',
      error: error.message || 'Unknown error occurred',
    }
  }
})