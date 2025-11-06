import type { Course } from './shared/auth'

export interface CoursesFilter {
  category?: string
  categories?: string[]
  level?: string
  levels?: string[]
  tags?: string[]
  instructorId?: number
  freeOnly?: boolean
  paidOnly?: boolean
  searchQuery?: string
}

export interface FilterOptions {
  categories: string[]
  levels: string[]
  instructors: { id: number; name: string }[]
}

export interface PaginatedCoursesResponse {
  courses: Course[]
  currentPage: number
  totalPages: number
  totalCount: number
}