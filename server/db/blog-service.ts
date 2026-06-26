import { db } from './index'
import { blogs, users } from './schema'
import { eq, desc } from 'drizzle-orm'
import type { Blog } from './schema'
import type { BlogStatus } from '../../app/types/blog'

export interface CreateBlogInput {
  title: string
  slug: string
  content: string
  excerpt?: string | null
  coverImage?: string | null
  status?: BlogStatus
  authorId: number
  readingTime?: number
  publishedAt?: Date | null
}
export interface UpdateBlogInput {
  title?: string
  slug?: string
  content?: string
  excerpt?: string | null
  coverImage?: string | null
  status?: BlogStatus
  readingTime?: number
  publishedAt?: Date | null
}
export async function getAllBlogs() {
  return db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      excerpt: blogs.excerpt,
      coverImage: blogs.coverImage,
      status: blogs.status,
      authorId: blogs.authorId,
      readingTime: blogs.readingTime,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
      },
    })
    .from(blogs)
    .leftJoin(users, eq(blogs.authorId, users.id))
    .orderBy(desc(blogs.createdAt))
}

export async function getPublishedBlogs() {
  return db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      excerpt: blogs.excerpt,
      coverImage: blogs.coverImage,
      status: blogs.status,
      authorId: blogs.authorId,
      readingTime: blogs.readingTime,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      },
    })
    .from(blogs)
    .leftJoin(users, eq(blogs.authorId, users.id))
    .where(eq(blogs.status, 'published'))
    .orderBy(desc(blogs.publishedAt))
}

export async function getBlogById(id: number): Promise<Blog | null> {
  const result = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1)

  return result[0] || null
}

export async function getBlogBySlug(slug: string) {
  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      excerpt: blogs.excerpt,
      coverImage: blogs.coverImage,
      status: blogs.status,
      authorId: blogs.authorId,
      readingTime: blogs.readingTime,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
      },
    })
    .from(blogs)
    .leftJoin(users, eq(blogs.authorId, users.id))
    .where(eq(blogs.slug, slug))
    .limit(1)

  return result[0] || null
}

export async function createBlog(data: CreateBlogInput): Promise<Blog> {
  const now = new Date()

  const result = await db
    .insert(blogs)
    .values({
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      status: data.status || 'draft',
      authorId: data.authorId,
      readingTime: data.readingTime || 1,
      publishedAt: data.publishedAt || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  const createdBlog = result[0]
  if (!createdBlog) {
    throw new Error('Failed to create blog - no result returned')
  }
  return createdBlog
}

export async function updateBlog(
  id: number,
  data: UpdateBlogInput,
): Promise<Blog | null> {
  const result = await db
    .update(blogs)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))
    .returning()

  return result[0] || null
}

export async function deleteBlog(id: number): Promise<boolean> {
  const result = await db
    .delete(blogs)
    .where(eq(blogs.id, id))
    .returning({ id: blogs.id })

  return result.length > 0
}

export async function isSlugExists(
  slug: string,
  excludeId?: number,
): Promise<boolean> {
  const query = db
    .select({ id: blogs.id })
    .from(blogs)
    .where(eq(blogs.slug, slug))
    .limit(1)

  const result = await query

  if (result.length === 0) return false

  const existing = result[0]
  if (!existing) return false

  if (excludeId && existing.id === excludeId) return false

  return true
}
