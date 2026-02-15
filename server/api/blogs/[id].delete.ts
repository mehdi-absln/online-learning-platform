// server/api/blogs/[id].delete.ts
import { getBlogById, deleteBlog } from '../../db/blog-service'
import { requireInstructor } from '../../utils/auth-helpers'

export default defineEventHandler(async (event) => {
  try {
    // ✅ چک instructor بودن
    const user = await requireInstructor(event)

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

    // ✅ چک کردن مالکیت (فقط نویسنده یا admin می‌تونه حذف کنه)
    if (existingBlog.authorId !== user.id && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only delete your own blogs',
      })
    }

    // حذف بلاگ
    await deleteBlog(blogId)

    setResponseStatus(event, 204)
    return null
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete blog',
      data: { message },
    })
  }
})