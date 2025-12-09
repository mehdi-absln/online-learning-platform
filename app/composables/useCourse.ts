import type { CourseDetailResponse } from '~/types/shared/api'

export const useCourse = async (slug: string) => {
  const coursesStore = useCoursesStore()

  const { data, pending, error, refresh } = useFetch<CourseDetailResponse>(`/api/courses/slug/${slug}`, {
    key: `course-${slug}`,
    transform: (response: CourseDetailResponse): CourseDetailResponse => {
      if (response.success && response.data) {
        // Sync with store
        coursesStore.detailedCourse = response.data
      }
      return response
    },
  })

  // Sync with store
  watch(data, (newData) => {
    if (newData?.success && newData.data) {
      coursesStore.detailedCourse = newData.data
    }
  }, { immediate: true })

  // Read from data first, fallback to store
  const course = computed(() => data.value?.data ?? coursesStore.detailedCourse)

  // Check for actual error (not just null data)
  const hasError = computed(() => {
    if (error.value) return true
    return !!(!pending.value && data.value && !data.value.success)
  })

  return {
    course,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
