import { getAllCategories, getAllLevels, getAllTags } from '../../db/course-service'

export default defineEventHandler(async (event) => {
  try {
    // Get all available filter options from the database
    const [categories, levels, tags] = await Promise.all([
      getAllCategories(),
      getAllLevels(),
      getAllTags()
    ])

    // For now, hardcoding instructors - in real app, you'd fetch from db
    // const instructors = await getAllInstructors() // Add this function to course-service later if needed

    return {
      success: true,
      data: {
        categories: categories,
        levels: levels,
        tags: tags,
        instructors: [] // Empty array for now - can be populated from db later
      }
    }
  } catch (error: unknown) {
    console.error('Error fetching filter options:', error)

    return {
      success: false,
      message: 'Failed to fetch filter options',
      error: (error as Error)?.message || 'Unknown error occurred'
    }
  }
})