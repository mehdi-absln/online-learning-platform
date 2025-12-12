import type { H3Event, setResponseStatus, getQuery } from 'h3'
import { getAllCourses, getCoursesCount } from '../../db/course-service'
import { safeParseInt, safeParseString } from '../../utils/safe-parse'
import { transformCoursesForClient } from '../../utils/course-transformer'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('Fetching courses with filters and pagination...')

    // Get query parameters for filtering and pagination
    const query = getQuery(event)

    // Parse categories, levels, and tags as arrays if they exist
    const parseArrayParam = (param: unknown): string[] | undefined => {
      if (!param) return undefined
      if (Array.isArray(param)) {
        return param
          .map(item => safeParseString(item))
          .filter(item => item !== undefined) as string[]
      }
      const singleValue = safeParseString(param)
      return singleValue ? [singleValue] : undefined
    }

    const filter = {
      category: safeParseString(query.category),
      categories: parseArrayParam(query.categories),
      level: safeParseString(query.level),
      levels: parseArrayParam(query.levels),
      tags: parseArrayParam(query.tags),
      freeOnly: query.freeOnly === 'true',
      paidOnly: query.paidOnly === 'true',
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

    const transformedCourses = transformCoursesForClient(courses)

    return {
      success: true,
      data: transformedCourses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCourses,
        itemsPerPage: limit,
      },
    }
  }
  catch (error: unknown) {
    console.error('Detailed error in GET /api/courses:', error)
    console.error('Error name:', (error as Error).name)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch courses',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
