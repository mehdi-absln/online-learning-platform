import { setResponseStatus } from 'h3'
import { sql, eq } from 'drizzle-orm'
import { courses, categories } from '../../../db/schema'
import { db } from '../../../db'

export default defineEventHandler(async (event) => {
  try {
    const categoriesResult = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .leftJoin(courses, eq(courses.categoryId, categories.id))
      .groupBy(categories.id, categories.name)
      .orderBy(categories.name)

    const categoriesList = categoriesResult.map(row => ({
      id: row.id,
      name: row.name,
    }))

    const levelsResult = await db
      .select({ level: courses.level })
      .from(courses)
      .groupBy(courses.level)
      .orderBy(courses.level)

    const levels = levelsResult
      .map(row => row.level)
      .filter((l): l is string => l !== null)

    const allTagsResult = await db
      .select({ tags: courses.tags })
      .from(courses)
      .where(sql`${courses.tags} IS NOT NULL`)

    const allTags = new Set<string>()
    allTagsResult.forEach((row) => {
      if (row.tags) {
        row.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .forEach(tag => allTags.add(tag))
      }
    })

    const tags = Array.from(allTags).sort()

    return {
      success: true,
      data: {
        categories: categoriesList,
        levels,
        tags,
      },
    }
  }
  catch (error: unknown) {
    console.error('Error fetching filter options:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch filter options',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
