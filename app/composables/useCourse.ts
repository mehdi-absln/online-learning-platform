import type { CourseDetailResponse } from '~/types/shared/api'
import { useApiError } from '~/composables/useApiError'

/**
 * Fetch single course by slug with perfect two-way sync to Pinia store.
 * Ensures:
 *   • Fresh data from API always wins
 *   • Store stays updated even on navigation/back-forward
 *   • Component always has latest course (data → store fallback)
 */

export const useCourse = (slug: string) => {
  const coursesStore = useCoursesStore()

  const { data, pending, error, refresh } = useFetch<CourseDetailResponse>(`/api/courses/slug/${slug}`, {
    key: `course-${slug}`,

    /** Immediately sync successful response to store */
    transform: (response: CourseDetailResponse): CourseDetailResponse => {
      if (response.success && response.data) {
        coursesStore.detailedCourse = response.data
      }
      return response
    },
  })

  /** Keep store in sync on subsequent updates (e.g. refresh, suspense re-fetch) */
  watch(data, (newData) => {
    if (newData?.success && newData.data) {
      coursesStore.detailedCourse = newData.data
    }
  }, { immediate: true })

  /** Reactive course – prefers fresh API data, falls back to store (e.g. during SSR or navigation) */
  const course = computed(() => data.value?.data ?? coursesStore.detailedCourse)

  /** Unified error state (network errors, 404, validation, etc.) */
  const hasError = useApiError(data, pending, error)

  return {
    course,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
