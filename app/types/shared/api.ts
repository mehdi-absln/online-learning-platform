// Define common API response types

// Generic response type for API calls
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

// Type for authentication responses
export interface AuthResponse {
  success: boolean
  user?: import('~/types/shared/auth').User
  message?: string
  error?: string
}

// Type for course list response
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

// Type for single course response
export interface CourseDetailResponse {
  success: boolean
  data: import('~/types/shared/courses').DetailedCourse
}

// Type for filter options response
export interface FilterOptionsResponse {
  success: boolean
  data: {
    categories: string[]
    levels: string[]
    tags: string[]
    instructors: { id: number, name: string }[]
  }
}

// Type for validation errors
export interface ValidationError {
  field: string
  message: string
}

// Type for validation error response
export interface ValidationErrorResponse {
  success: boolean
  message: string
  errors: ValidationError[]
}
