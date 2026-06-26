// server/api/blogs/[id].get.ts
import { getBlogById, getBlogBySlug } from '../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Blog ID or slug is required',
      })
    }

    let blog

    if (/^\d+$/.test(idParam)) {
      const blogId = parseInt(idParam, 10)
      blog = await getBlogById(blogId)
    }
    else {
      blog = await getBlogBySlug(idParam)
    }

    if (!blog) {
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
