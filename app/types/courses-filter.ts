import type { Course } from './shared/courses'

export interface CoursesFilter {
  category?: string
  categories?: string[]
  level?: string
  levels?: string[]
  tags?: string[]
  instructorId?: number
  priceFilter?: 'all' | 'free' | 'paid'
  // For backward compatibility with old URL parameters
  freeOnly?: boolean
  paidOnly?: boolean
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
}

export interface ExtendedCoursesFilter extends CoursesFilter {
  categories: string[]
  levels: string[]
  tags: string[]
  priceFilter: 'all' | 'free' | 'paid'
  // For backward compatibility with old URL parameters
  freeOnly: boolean
  paidOnly: boolean
  searchQuery: string
  minPrice?: number
  maxPrice?: number
  [key: string]: unknown // Allow any additional properties for use in dynamic property access
}

export interface FilterOptions {
  categories: string[]
  levels: string[]
  instructors: { id: number, name: string }[]
}

export interface PaginatedCoursesResponse {
  courses: Course[]
  currentPage: number
  totalPages: number
  totalCount: number
}
