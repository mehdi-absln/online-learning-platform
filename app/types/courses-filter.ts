export interface CoursesFilter {
  category?: string
  categories?: string[]
  level?: string
  levels?: string[]
  tags?: string[]
  instructorId?: number
  priceFilter?: 'all' | 'free' | 'paid'
  freeOnly?: boolean
  paidOnly?: boolean
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
}
