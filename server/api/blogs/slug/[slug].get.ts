// server/api/blogs/slug/[slug].get.ts
import { getBlogBySlug } from '../../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
    setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Blog slug is required',
      })
    }

    const blog = await getBlogBySlug(slug)

    if (!blog) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog not found',
      })
    }

    if (blog.status !== 'published') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog not found',
      })
    }

    return {
      success: true,
      data: blog,
    }
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Unknown error'

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog',
      data: { message },
    })
  }
})
