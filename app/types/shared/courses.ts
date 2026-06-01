export interface Course {
  id: number
  title: string
  description: string | null
  category: string
  instructor: {
    name: string
    avatar: string
    title?: string
  }
  stats: {
    students: number
  }
  rating: number
  price: number
  level: string
  tags?: string
  thumbnail: string | null
  slug: string
  createdAt: Date
  updatedAt: Date
  instructorId: number
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

export interface DetailedCourse extends Course {
  lessons: string[]
  learningObjectives?: string[]
  courseContent?: CourseContentSection[]
  reviews?: Review[]
}

export interface Lesson {
  id: number
  courseId: number
  title: string
  content: string
  videoUrl: string
  order: number
  sectionId?: number
  createdAt: Date
  updatedAt: Date
}

export interface DetailedLesson extends CourseContentLesson {
  id: number
  courseId: number
  content: string
  order: number
  sectionId?: number
  createdAt?: Date
  updatedAt?: Date
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

export interface Review {
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
