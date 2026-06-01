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
  CourseContentSection,
  Lesson,
} from '~/types/shared/courses'

export type {
  Blog,
  BlogsResponse as BlogListResponse,
  BlogResponse as BlogDetailResponse,
} from '~/types/shared/blogs'

export type {
  SignInFormData,
  SignUpFormData,
} from '~/schemas/auth'
