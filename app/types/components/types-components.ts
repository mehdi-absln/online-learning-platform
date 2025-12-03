import type { BreadcrumbItem } from './types'

// Interfaces for Breadcrumb component
export interface BreadcrumbProps {
  crumbs: BreadcrumbItem[]
}

// Interfaces for CourseCard component
export interface CourseCardProps {
  course: import('./shared/courses').Course
}

// Interfaces for LoadingSpinner component
export interface LoadingSpinnerProps {
  message?: string
}

// Interfaces for CoursesGrid component
export interface CoursesGridProps {
  courses: import('./shared/courses').Course[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Interfaces for CoursesHero component
export interface CoursesHeroProps {
  breadcrumbCrumbs: { name: string; path: string }[]
}
