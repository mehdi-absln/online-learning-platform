import { setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // In a real application, these would be fetched from the database
    // For now, returning static data as an example
    const filterOptions = {
      categories: [
        'Programming', 
        'Design', 
        'Marketing', 
        'Photography', 
        'Data Science', 
        'Business',
        'Music',
        'Health & Fitness'
      ],
      levels: [
        'Beginner', 
        'Intermediate', 
        'Advanced',
        'All Levels'
      ],
      tags: [
        'WordPress', 
        'JavaScript', 
        'Python', 
        'UI/UX', 
        'React', 
        'Vue',
        'Angular',
        'Node.js',
        'TypeScript',
        'Machine Learning'
      ]
    }

    return {
      success: true,
      data: filterOptions
    }
  } catch (error: unknown) {
    console.error('Error fetching filter options:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch filter options',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})