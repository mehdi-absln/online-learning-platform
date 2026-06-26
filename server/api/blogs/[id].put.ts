// server/api/blogs/[id].put.ts
import { z } from 'zod'
import { getBlogById, updateBlog, isSlugExists, type UpdateBlogInput } from '../../db/blog-service'
import { requireInstructor } from '../../utils/auth-helpers'
import { calculateReadingTime } from '../../utils/blog-helpers'

const updateBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .optional(),
  excerpt: z
    .string()
    .max(500, 'Excerpt is too long')
    .nullable()
    .optional(),
  coverImage: z
    .string()
    .url('Invalid image URL')
    .nullable()
    .optional(),
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional(),
  publishedAt: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform(val => val ? new Date(val) : null),
})

export default defineEventHandler(async (event) => {
  try {
    const user = await requireInstructor(event)

    const idParam = getRouterParam(event, 'id')
    const blogId = parseInt(idParam || '', 10)

    if (isNaN(blogId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid blog ID',
      })
    }

    const existingBlog = await getBlogById(blogId)
    if (!existingBlog) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog not found',
      })
    }

    if (existingBlog.authorId !== user.id && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only edit your own blogs',
      })
    }

    const body = await readBody(event)

    const result = updateBlogSchema.safeParse(body)

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

    if (data.slug && data.slug !== existingBlog.slug) {
      const slugExists = await isSlugExists(data.slug, blogId)
      if (slugExists) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Slug already exists',
          data: { field: 'slug' },
        })
      }
    }

    if (
      data.status === 'published'
      && existingBlog.status !== 'published'
      && !data.publishedAt
      && !existingBlog.publishedAt
    ) {
      data.publishedAt = new Date()
    }

    const updateData: UpdateBlogInput = { ...data }
    if (data.content) {
      updateData.readingTime = calculateReadingTime(data.content)
    }

    const updatedBlog = await updateBlog(blogId, updateData)

    return {
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully',
    }
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update blog',
      data: { message },
    })
  }
})
