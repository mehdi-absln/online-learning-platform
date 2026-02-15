// تایپ اصلی بلاگ
export interface Blog {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  status: 'draft' | 'published' | 'archived'
  authorId: number
  readingTime: number // ✨ جدید
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

// برای ایجاد بلاگ جدید
export interface CreateBlogInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  status?: 'draft' | 'published' | 'archived'
  authorId: number
  publishedAt?: string
}

// برای آپدیت بلاگ
export interface UpdateBlogInput {
  title?: string
  slug?: string
  content?: string
  excerpt?: string | null
  coverImage?: string | null
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string | null
}

// پاسخ API برای لیست
export interface BlogsResponse {
  success: boolean
  data: Blog[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
}

// پاسخ API برای یک بلاگ
export interface BlogResponse {
  success: boolean
  data: Blog
  message?: string
}

// ✅ ساده‌شده - فقط search
export interface BlogFilters {
  search: string
}