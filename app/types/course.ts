// ──────────────────────────────────────
// Course domain types
// ──────────────────────────────────────

export interface CourseInstructor {
  id?: number
  name: string
  avatar: string
  title?: string
}

export interface Course {
  id: number
  title: string
  slug: string
  description: string | null
  category: string
  instructor: CourseInstructor
  stats: {
    students: number
  }
  rating: number
  price: number
  level: string
  tags?: string
  thumbnail: string | null
  instructorId: number
  createdAt: Date
  updatedAt: Date
}

export interface CourseApiResponse {
  id: string
  title: string
  slug: string
  description?: string
  thumbnail?: string | null
  price: number
  discountPrice?: number
  duration?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
  rating?: number
  studentsCount?: number
  isPublished?: boolean
  categoryId?: string
  instructorId?: string
  createdAt?: string
  updatedAt?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  instructor?: {
    id: string
    name: string
    avatar?: string
    title: string
  }
  tags?: {
    id: string
    name: string
  }[]
}

export interface DetailedCourse extends Course {
  lessons: string[]
  learningObjectives?: string[]
  courseContent?: CourseContentSection[]
  reviews?: CourseReview[]
}

export interface CourseContentSection {
  id: number
  title: string
  description?: string
  lessons: number
  content?: CourseContentLesson[]
}

export interface CourseContentLesson {
  id?: number
  title: string
  slug: string
  duration: string
  videoUrl?: string
  description?: string
  isFree?: boolean
}

export interface CourseReview {
  id: number
  rating: number
  comment: string | null
  createdAt: string | Date
  user?: {
    id: number
    name: string | null
    avatar: string | null
  }
}

export type Review = CourseReview

export interface CourseFilters {
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

export type CoursesFilter = CourseFilters

export interface FilterOptions {
  categories: { id: number, name: string }[]
  levels: string[]
  tags: string[]
  instructors?: { id: number, name: string }[]
}

export interface CreateCourseData {
  title: string
  description: string
  category: string
  instructorId: number
  price: number
  level: string
  image?: string | null
}

export interface UpdateCourseData {
  title?: string
  description?: string
  category?: string
  instructorId?: number
  studentsCount?: number
  rating?: number
  price?: number
  level?: string
  image?: string | null
}
