// server/api/blogs/index.post.ts
import { z } from 'zod'
import { createBlog, isSlugExists } from '../../db/blog-service'

const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z
    .string()
    .min(1, 'Content is required'),
  excerpt: z
    .string()
    .max(500, 'Excerpt is too long')
    .optional(),
  coverImage: z
    .string()
    .url('Invalid image URL')
    .optional(),
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional()
    .default('draft'),
  authorId: z
    .number()
    .int()
    .positive('Invalid author ID'),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation
    const result = createBlogSchema.safeParse(body)
    
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: {
          errors: result.error.flatten().fieldErrors,
        },
      })
    }
    
    const data = result.data
    
    // بررسی تکراری نبودن slug
    const slugExists = await isSlugExists(data.slug)
    if (slugExists) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Slug already exists',
        data: { field: 'slug' },
      })
    }
    
    // اگر status = published و publishedAt نداریم
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date()
    }
    
    // ایجاد بلاگ
    const blog = await createBlog(data)
    
    setResponseStatus(event, 201)
    return {
      success: true,
      data: blog,
      message: 'Blog created successfully',
    }
  } 
  catch (error: any) {
    // اگر خطا از نوع H3Error باشد، دوباره throw کن
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create blog',
      data: { message: error.message },
    })
  }
})