import type { Course } from './shared/auth'

export interface CoursesFilter {
  category?: string
  level?: string
  instructorId?: number
  minPrice?: number
  maxPrice?: number
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