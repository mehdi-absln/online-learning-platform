import type { Course } from './shared/courses'

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

export interface ExtendedCoursesFilter extends CoursesFilter {
  categories: string[]
  levels: string[]
  tags: string[]
  freeOnly: boolean
  paidOnly: boolean
  searchQuery: string
  [key: string]: any // Allow other properties from the original CoursesFilter
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