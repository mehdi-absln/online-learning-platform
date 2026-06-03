// ──────────────────────────────────────
// Blog domain types
// ──────────────────────────────────────

export type BlogStatus = 'draft' | 'published' | 'archived'

export interface Blog {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  status: BlogStatus
  authorId: number
  readingTime: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    name: string
    avatar?: string
    email?: string
  }
}

export interface CreateBlogInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  status?: BlogStatus
  authorId: number
  publishedAt?: string
}

export interface UpdateBlogInput {
  title?: string
  slug?: string
  content?: string
  excerpt?: string | null
  coverImage?: string | null
  status?: BlogStatus
  publishedAt?: string | null
}

export interface BlogFilters {
  search: string
}
