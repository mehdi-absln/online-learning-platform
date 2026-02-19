// Barrel file for common type exports
// Re-export from shared types for convenience

export type {
  User,
  AuthResponse,
  CourseStats,
  CourseInstructor,
  Course,
  JWTPayload,
} from '~/types/shared/auth'

export type {
  ApiResponse,
  CourseListResponse,
  CourseDetailResponse,
  FilterOptionsResponse,
  ValidationError,
  ValidationErrorResponse,
} from '~/types/shared/api'

export type {
  DetailedCourse,
  Review,
  LearningObjective,
  CourseContentSection,
  Lesson,
} from '~/types/shared/courses'

export type {
  Blog,
  BlogListResponse,
  BlogDetailResponse,
} from '~/types/shared/blogs'

export type {
  SignInFormData,
  SignUpFormData,
} from '~/schemas/auth'
