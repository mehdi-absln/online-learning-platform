import { getAllCategories, getAllLevels, getAllTags } from '../../db/course-service'

export default defineEventHandler(async (event) => {
  try {
    setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
    // Get all available filter options from the database
    const [categories, levels, tags] = await Promise.all([
      getAllCategories(),
      getAllLevels(),
      getAllTags(),
    ])

    // For now, hardcoding instructors - in real app, you'd fetch from db
    // const instructors = await getAllInstructors() // Add this function to course-service later if needed

    return {
      success: true,
      data: {
        categories: categories,
        levels: levels,
        tags: tags,
        instructors: [], // Empty array for now - can be populated from db later
      },
    }
  }
  catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to fetch filter options',
      error: (error as Error)?.message || 'Unknown error occurred',
    }
  }
})
