import type { ApiResponse } from '~/types/shared/api'
import type {
  DashboardData,
  DashboardEnrolledCourse,
  DashboardStats,
  DashboardOrder,
  DashboardBookmark,
} from '~/types/shared/dashboard'

export function useDashboard() {
  const requestHeaders = import.meta.server
    ? useRequestHeaders(['cookie'])
    : {}

  const { data: raw, pending: loading, error, refresh } = useAsyncData(
    'dashboard',
    () => $fetch<ApiResponse<DashboardData>>('/api/dashboard', {
      headers: requestHeaders,
      credentials: 'include',
    }),
  )

  const data = computed(() => raw.value?.data ?? null)

  const enrolledCourses = computed<DashboardEnrolledCourse[]>(
    () => data.value?.enrolledCourses ?? [],
  )

  const stats = computed<DashboardStats>(
    () => data.value?.stats ?? {
      totalEnrolled: 0,
      totalCompleted: 0,
      inProgress: 0,
      totalBookmarked: 0,
    },
  )

  const recentOrders = computed<DashboardOrder[]>(
    () => data.value?.recentOrders ?? [],
  )

  const bookmarkedLessons = computed<DashboardBookmark[]>(
    () => data.value?.bookmarkedLessons ?? [],
  )

  // First in-progress course (for "Continue Learning" section)
  const continueLearnCourse = computed<DashboardEnrolledCourse | null>(() => {
    return enrolledCourses.value.find(
      c => c.progressPercentage > 0 && c.progressPercentage < 100,
    ) ?? enrolledCourses.value.find(
      c => c.progressPercentage === 0 && c.totalLessons > 0,
    ) ?? null
  })

  return {
    data,
    loading,
    error,
    refresh,
    enrolledCourses,
    stats,
    recentOrders,
    bookmarkedLessons,
    continueLearnCourse,
  }
}
