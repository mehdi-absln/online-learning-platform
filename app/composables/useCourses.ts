import type { CourseListResponse } from '~/types/shared/api'
import { useApiError } from '~/composables/useApiError'

export const useCourses = () => {
  const coursesStore = useCoursesStore()

  const queryParams = computed(() => {
    const filter = coursesStore.currentFilter
    const params: Record<string, string | string[] | number | boolean> = {
      page: coursesStore.currentPage,
      limit: coursesStore.itemsPerPage,
    }

    if (filter.category) params.category = filter.category
    if (filter.categories?.length) params.categories = filter.categories
    if (filter.level) params.level = filter.level
    if (filter.levels?.length) params.levels = filter.levels
    if (filter.tags?.length) params.tags = filter.tags
    if (filter.freeOnly) params.freeOnly = true
    if (filter.paidOnly) params.paidOnly = true
    if (filter.searchQuery) params.q = filter.searchQuery
    if (filter.instructorId) params.instructorId = filter.instructorId
    if (filter.minPrice) params.minPrice = filter.minPrice
    if (filter.maxPrice) params.maxPrice = filter.maxPrice

    return params
  })

  const { data, pending, error, refresh } = useFetch<CourseListResponse>('/api/courses', {
    query: queryParams,
    watch: [queryParams],
    deep: true,
    transform: (response: CourseListResponse): CourseListResponse => {
      if (response.success && response.data) {
        // Sync with store
        coursesStore.courses = response.data
        if (response.pagination) {
          coursesStore.currentPage = response.pagination.currentPage
          coursesStore.totalPages = response.pagination.totalPages
          coursesStore.totalItems = response.pagination.totalItems
          coursesStore.itemsPerPage = response.pagination.itemsPerPage
        }
      }
      return response
    },
  })

  // Sync with store
  watch(data, (newData) => {
    if (newData?.success && newData.data) {
      coursesStore.courses = newData.data
      if (newData.pagination) {
        coursesStore.currentPage = newData.pagination.currentPage
        coursesStore.totalPages = newData.pagination.totalPages
        coursesStore.totalItems = newData.pagination.totalItems
        coursesStore.itemsPerPage = newData.pagination.itemsPerPage
      }
    }
  }, { immediate: true })

  // Read from data first, fallback to store
  const courses = computed(() => data.value?.data || coursesStore.courses)
  const pagination = computed(() => {
    if (data.value?.pagination) return data.value.pagination
    // Fallback to store values if not in response
    return {
      currentPage: coursesStore.currentPage,
      totalPages: coursesStore.totalPages,
      totalItems: coursesStore.totalItems,
      itemsPerPage: coursesStore.itemsPerPage,
    }
  })

  // Check for actual error using shared composable
  const hasError = useApiError(data, pending, error)

  return {
    courses,
    pagination,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
