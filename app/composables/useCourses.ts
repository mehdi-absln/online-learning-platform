// app/composables/useCourses.ts
import type { CourseListResponse } from '~/types/shared/api'
import { useApiError } from '~/composables/useApiError'

export const useCourses = () => {
  const route = useRoute()
  const coursesStore = useCoursesStore()
  const { setPagination } = useCourseFilters()

  const queryParams = computed(() => {
    const query = route.query
    const params: Record<string, any> = {
      page: Number(query.page) || 1,
      limit: 12,
    }

    if (query.categories) params.categories = query.categories
    if (query.levels) params.levels = query.levels
    if (query.tags) params.tags = query.tags
    if (query.freeOnly === 'true') params.freeOnly = true
    if (query.paidOnly === 'true') params.paidOnly = true
    if (query.q) params.q = query.q
    if (query.instructorId) params.instructorId = query.instructorId
    if (query.minPrice) params.minPrice = query.minPrice
    if (query.maxPrice) params.maxPrice = query.maxPrice

    return params
  })

  const { data, pending, error } = useFetch<CourseListResponse>('/api/courses', {
    query: queryParams,
    onResponse: ({ response }) => {
      if (response._data?.success && response._data.data) {
        coursesStore.setCourses(response._data.data)

        if (response._data.pagination) {
          setPagination({
            currentPage: response._data.pagination.currentPage,
            totalItems: response._data.pagination.totalItems,
            limit: response._data.pagination.itemsPerPage,
          })
        }
      }
    },
  })

  const hasError = useApiError(data, pending, error)

  return {
    courses: computed(() => data.value?.data || []),
    isLoading: pending, // ✅ فقط از useFetch
    error: hasError,
  }
}
