import { setResponseStatus } from 'h3'
import { getAllCourses } from '../../../server/db/course-service'

export default defineEventHandler(async (event) => {
  try {
    // Fetch all courses without any filters to get the total count
    const allCourses = await getAllCourses()

    return {
      success: true,
      data: {
        totalCourses: allCourses.length,
        courses: allCourses, // Include the courses data to inspect
      },
    }
  }
  catch (error: unknown) {
    console.error('Error fetching courses count:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch courses count',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
