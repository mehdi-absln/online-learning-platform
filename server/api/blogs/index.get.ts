// server/api/blogs/index.get.ts
import { getAllBlogs, getPublishedBlogs } from '../../db/blog-service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const showAll = query.all === 'true'

    // اگر all=true باشد همه بلاگ‌ها، وگرنه فقط منتشر شده‌ها
    const blogs = showAll
      ? await getAllBlogs()
      : await getPublishedBlogs()

    return {
      success: true,
      data: blogs,
      count: blogs.length,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blogs',
      data: { message: error.message },
    })
  }
})
