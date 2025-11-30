import { setResponseStatus } from 'h3'
import { sql } from 'drizzle-orm'
import { courses } from '../../../db/schema'
import { db } from '../../../db'

export default defineEventHandler(async (event) => {
  try {
    // Fetch unique categories from the database
    const categoriesResult = await db
      .select({ category: courses.category })
      .from(courses)
      .groupBy(courses.category)
      .orderBy(courses.category)

    const categories = categoriesResult.map((row) => row.category)

    // Fetch unique levels from the database
    const levelsResult = await db
      .select({ level: courses.level })
      .from(courses)
      .groupBy(courses.level)
      .orderBy(courses.level)

    const levels = levelsResult.map((row) => row.level)

    // Fetch unique tags from the database
    // Since tags are stored as comma-separated values, we need to extract unique tags
    const allTagsResult = await db
      .select({ tags: courses.tags })
      .from(courses)
      .where(sql`${courses.tags} IS NOT NULL`)

    // Extract unique tags from all courses
    const allTags = new Set<string>()
    allTagsResult.forEach((row) => {
      if (row.tags) {
        // Split comma-separated tags and trim whitespace
        const tags = row.tags.split(',').map((tag) => tag.trim())
        tags.forEach((tag) => {
          if (tag) allTags.add(tag)
        })
      }
    })

    const tags = Array.from(allTags).sort()

    const filterOptions = {
      categories,
      levels,
      tags
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
      error: (error as Error).message || 'Unknown error occurred'
    }
  }
})
