// server/api/blogs/slug/[slug].get.ts
import { getBlogBySlug } from '../../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
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
    
    // فقط بلاگ‌های منتشر شده
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