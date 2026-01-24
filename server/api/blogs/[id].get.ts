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

    // اگر عدد باشد با ID جستجو کن، وگرنه با slug
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
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog',
      data: { message: error.message },
    })
  }
})
