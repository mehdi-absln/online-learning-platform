// server/api/blogs/index.get.ts
import { getAllBlogs, getPublishedBlogs } from '../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
    setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
    const query = getQuery(event)
    const showAll = query.all === 'true'
    const searchQuery = query.q as string || ''
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 9 // Accept from query, default to 9

    // Get all blogs based on permissions
    const allBlogs = showAll
      ? await getAllBlogs()
      : await getPublishedBlogs()

    // Apply search filter if query exists
    let filteredBlogs = allBlogs
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase()
      filteredBlogs = allBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm)
        || blog.content?.toLowerCase().includes(searchTerm)
        || blog.excerpt?.toLowerCase().includes(searchTerm),
      )
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filteredBlogs.length / limit)

    return {
      success: true,
      data: paginatedBlogs,
      total: filteredBlogs.length, // Total after filtering
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredBlogs.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blogs',
      data: { message },
    })
  }
})
