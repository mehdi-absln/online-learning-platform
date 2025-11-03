import { H3Event } from 'h3'
import { getAllCourses, getCoursesCount } from '../../db/course-service'
import { setResponseStatus } from 'h3'
import { getQuery } from 'h3'
import { and, eq, like, gte, lte } from 'drizzle-orm'
import { safeParseInt, safeParseString } from '../../utils/safe-parse'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching courses with filters and pagination...')
    
    // Get query parameters for filtering and pagination
    const query = getQuery(event)
    
    const filter = {
      category: safeParseString(query.category),
      level: safeParseString(query.level),
      minPrice: safeParseInt(query.minPrice),
      maxPrice: safeParseInt(query.maxPrice),
      searchQuery: safeParseString(query.q),
      instructorId: safeParseInt(query.instructorId),
    }
    
    // Pagination parameters
    const page = query.page ? Math.max(1, Number(query.page)) : 1
    const limit = query.limit ? Math.min(50, Math.max(1, Number(query.limit))) : 12 // Default 12 courses per page
    const offset = (page - 1) * limit
    
    console.log('Applied filters:', filter)
    console.log('Pagination params: page:', page, 'limit:', limit, 'offset:', offset)
    
    // Get filtered courses with pagination
    const courses = await getAllCourses(filter, limit, offset)
    const totalCourses = await getCoursesCount(filter)
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCourses / limit)
    
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
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCourses,
        itemsPerPage: limit
      }
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