// Dashboard API response types

export interface DashboardEnrolledCourse {
  id: number
  title: string
  slug: string
  thumbnail: string | null
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  lastAccessedLesson: {
    title: string
    slug: string
  } | null
}

export interface DashboardStats {
  totalEnrolled: number
  totalCompleted: number
  inProgress: number
  totalBookmarked: number
}

export interface DashboardOrder {
  id: number
  totalAmount: number
  status: string
  createdAt: Date | string
}

export interface DashboardBookmark {
  lessonId: number
  lessonTitle: string
  lessonSlug: string
  courseTitle: string
  courseSlug: string
}

export interface DashboardData {
  enrolledCourses: DashboardEnrolledCourse[]
  stats: DashboardStats
  recentOrders: DashboardOrder[]
  bookmarkedLessons: DashboardBookmark[]
}
