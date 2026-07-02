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
  const nuxtApp = useNuxtApp()

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

  // Generate unique cache key based on all query params
  const cacheKey = computed(() => {
    const params = queryParams.value
    return `courses-${JSON.stringify(params)}`
  })

  const { data, pending, error } = useFetch<CourseListResponse>('/api/courses', {
    key: cacheKey,
    query: queryParams,
    // Client-side cache for 5 minutes (300000ms)
    getCachedData(key) {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data) return

      const expirationDate = new Date(data.fetchedAt)
      expirationDate.setTime(expirationDate.getTime() + 300000) // 5 minutes
      const isExpired = expirationDate.getTime() < Date.now()
      if (isExpired) return

      return data
    },
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
