export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface AuthResponse {
  success: boolean
  data?: {
    user?: import('~/types/shared/auth').User
  }
  message?: string
  error?: string
}

export interface CourseListResponse {
  success: boolean
  data: import('~/types/shared/courses').Course[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface CourseDetailResponse {
  success: boolean
  data: import('~/types/shared/courses').DetailedCourse
}

export interface FilterOptionsResponse {
  success: boolean
  data: {
    categories: { id: number, name: string }[]
    levels: string[]
    tags: string[]
    instructors?: { id: number, name: string }[]
  }
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationErrorResponse {
  success: boolean
  message: string
  errors: ValidationError[]
}
