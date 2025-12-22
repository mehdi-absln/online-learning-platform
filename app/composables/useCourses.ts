import type { CourseListResponse } from '~/types/shared/api'
import { useApiError } from '~/composables/useApiError'

interface UrlQueryParams {
  page: number
  limit: number
  categories?: string[]
  levels?: string[]
  tags?: string[]
  q?: string
  instructorId?: number
  minPrice?: number
  maxPrice?: number
  freeOnly?: boolean
  paidOnly?: boolean
}

/**
 * Reactive course list fetcher with full sync between:
 * → Pinia store (filter + pagination)
 * → URL query params (via useCourseFilters)
 * → API endpoint
 */
export const useCourses = () => {
  const coursesStore = useCoursesStore()

  /** Build clean API query params from current filter state – only includes active filters */
  const queryParams = computed(() => {
    const filter = coursesStore.currentFilter
    const params: UrlQueryParams = {
      page: coursesStore.currentPage,
      limit: coursesStore.itemsPerPage,
    }

    if (filter.categories?.length) params.categories = filter.categories
    if (filter.levels?.length) params.levels = filter.levels
    if (filter.tags?.length) params.tags = filter.tags
    if (filter.priceFilter === 'free') params.freeOnly = true
    if (filter.priceFilter === 'paid') params.paidOnly = true
    if (filter.searchQuery) params.q = filter.searchQuery
    if (filter.instructorId !== undefined && filter.instructorId !== null) {
      params.instructorId = filter.instructorId
    }
    if (filter.minPrice !== undefined && filter.minPrice !== null) {
      params.minPrice = filter.minPrice
    }
    if (filter.maxPrice !== undefined && filter.maxPrice !== null) {
      params.maxPrice = filter.maxPrice
    }

    return params
  })

  /** Auto-refetch whenever filter or page changes */
  const { data, pending, error } = useFetch<CourseListResponse>('/api/courses', {
    query: queryParams,
    watch: [queryParams],

    /** Update store on successful response */
    onResponse: ({ response }) => {
      if (response._data?.success && response._data.data) {
        coursesStore.setCourses(response._data.data)
        if (response._data.pagination) {
          coursesStore.setPagination(response._data.pagination)
        }
      }

      nextTick(() => {
        coursesStore.loading = false
      })
    },

    /** Log error and finalize loading state */
    onResponseError: ({ response, error: fetchError }) => {
      console.error('Error loading courses:', {
        status: response?.status,
        error: fetchError,
        data: response?._data,
      })

      nextTick(() => {
        coursesStore.loading = false
      })
    },
  })

  const hasError = useApiError(data, pending, error)

  return {
    /** Current page courses – reactive */
    courses: computed(() => data.value?.data || []),

    /** Pagination info with fallback to store values during initial load */
    pagination: computed(() => data.value?.pagination || {
      currentPage: coursesStore.currentPage,
      totalPages: coursesStore.totalPages,
      totalItems: coursesStore.totalItems,
      itemsPerPage: coursesStore.itemsPerPage,
    }),

    /** Loading when fetching OR when store is preparing next request */
    isLoading: computed(() => pending.value || coursesStore.loading),

    /** Unified error state (network, 404, 500, etc.) */
    error: hasError,
  }
}
