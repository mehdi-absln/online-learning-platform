// server/api/blogs/[id].delete.ts
import { getBlogById, deleteBlog } from '../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const blogId = parseInt(idParam || '', 10)
    
    if (isNaN(blogId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid blog ID',
      })
    }
    
    // بررسی وجود بلاگ
    const existingBlog = await getBlogById(blogId)
    if (!existingBlog) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog not found',
      })
    }
    
    // حذف بلاگ
    await deleteBlog(blogId)
    
    setResponseStatus(event, 204)
    return null
  } 
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete blog',
      data: { message: error.message },
    })
  }
})