// app/composables/useCourses.ts
import type { ApiResponse } from '~/types/api'
import type { Course } from '~/types/course'
import { useApiError } from '~/composables/useApiError'

type CourseListResponse = ApiResponse<Course[]>
type QueryParamValue = string | null | Array<string | null> | undefined

interface CourseQueryParams {
  page: number
  limit: number
  categories?: string | string[]
  levels?: string | string[]
  tags?: string | string[]
  freeOnly?: boolean
  paidOnly?: boolean
  q?: string
  instructorId?: number
  minPrice?: number
  maxPrice?: number
}

export const useCourses = () => {
  const route = useRoute()
  const coursesStore = useCoursesStore()
  const { setPagination } = useCourseFilters()

  const queryParams = computed<CourseQueryParams>(() => {
    const query = route.query

    // Normalize and parse query parameters to ensure type safety
    const parseNumber = (val: QueryParamValue): number | undefined => {
      const normalized = Array.isArray(val) ? val[0] : val
      if (!normalized) return undefined
      const parsed = Number(normalized)
      return isNaN(parsed) ? undefined : parsed
    }

    const parseString = (val: QueryParamValue): string | undefined => {
      const normalized = Array.isArray(val) ? val[0] : val
      if (!normalized) return undefined
      return String(normalized)
    }

    const params: CourseQueryParams = {
      page: parseNumber(query.page) || 1,
      limit: parseNumber(query.limit) || 12,
    }

    if (query.categories) params.categories = query.categories as string | string[]
    if (query.levels) params.levels = query.levels as string | string[]
    const rawTags = query.tags ?? query.tag
    if (rawTags) params.tags = rawTags as string | string[]
    if (query.freeOnly === 'true') params.freeOnly = true
    if (query.paidOnly === 'true') params.paidOnly = true

    const q = parseString(query.q)
    if (q) params.q = q

    const instructorId = parseNumber(query.instructorId)
    if (instructorId !== undefined) params.instructorId = instructorId

    const minPrice = parseNumber(query.minPrice)
    if (minPrice !== undefined) params.minPrice = minPrice

    const maxPrice = parseNumber(query.maxPrice)
    if (maxPrice !== undefined) params.maxPrice = maxPrice

    return params
  })

  // FIX FOR INFINITE LOOP:
  // Root cause: Using computed/reactive key caused useFetch to re-trigger infinitely
  // Solution: Use a static string key and let useFetch handle query reactivity naturally
  const { data, pending, error } = useFetch<CourseListResponse>('/api/courses', {
    // Static key - useFetch will handle query param changes automatically
    key: 'courses-list',
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
    isLoading: pending,
    error: hasError,
  }
}
