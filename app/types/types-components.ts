import type { BreadcrumbItem } from './types'

// Interfaces for Breadcrumb component
export interface BreadcrumbProps {
  crumbs: BreadcrumbItem[]
}

// Interfaces for CourseCard component
export interface CourseCardProps {
  course: import('./shared/courses').Course
}
