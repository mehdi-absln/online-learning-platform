// app/composables/useCourseFilters.ts
import { debounce } from 'lodash-es'
import type { CourseFilters, FilterOptions } from '~/types/course'
import type { ApiResponse } from '~/types/api'
import { extractParamsFromUrl, buildQueryParams } from '~/utils/course-helpers'

type FilterOptionsResponse = ApiResponse<FilterOptions>

const COURSE_LIMIT = 12

export const useCourseFilters = () => {
  const route = useRoute()
  const router = useRouter()

  // ───── Fetch filter options ─────
  const { data: optionsData, pending: optionsLoading, error: optionsError }
    = useFetch<FilterOptionsResponse>('/api/courses/filter-options', {
      key: 'filter-options',
    })

  const categories = computed(() => optionsData.value?.data?.categories || [])
  const levels = computed(() => optionsData.value?.data?.levels || [])
  const tags = computed(() => optionsData.value?.data?.tags || [])
  const instructors = computed(() => optionsData.value?.data?.instructors || [])

  // ✅ URL = Single Source of Truth
  const urlParams = computed(() => extractParamsFromUrl(route.query))

  // ✅ Current filter from URL
  const filter = computed(() => urlParams.value.filter)

  const hasActiveFilters = computed(() => {
    const f = filter.value
    return !!(
      f.categories?.length
      || f.levels?.length
      || f.tags?.length
      || (f.priceFilter && f.priceFilter !== 'all')
      || f.searchQuery
    )
  })

  // ✅ Update URL helper
  const updateFilters = (newFilter: CourseFilters, page: number = 1) => {
    const queryParams = buildQueryParams(newFilter, page, COURSE_LIMIT)

    const searchParamsToQueryObject = (params: URLSearchParams) => {
      const query: Record<string, string | string[]> = {}

      for (const [key, value] of params.entries()) {
        const existing = query[key]

        if (!existing) {
          query[key] = value
        }
        else if (Array.isArray(existing)) {
          existing.push(value)
        }
        else {
          query[key] = [existing, value]
        }
      }
      return query
    }

    const queryObject = searchParamsToQueryObject(queryParams)

    router.push({
      path: '/courses',
      query: Object.keys(queryObject).length ? queryObject : undefined,
    })
  }

  const applyFilters = debounce((newFilter: CourseFilters) => {
    updateFilters(newFilter, 1)
  }, 300)

  const applyFiltersImmediate = (newFilter?: CourseFilters) => {
    applyFilters.cancel()
    const filterToApply = newFilter ?? filter.value
    updateFilters(filterToApply, 1)
  }

  const resetFilters = () => {
    router.push({ path: '/courses' })
  }

  const changePage = (page: number) => {
    updateFilters(filter.value, page)
  }

  // ✅ SSR-safe shared state
  const totalItems = useState<number>('course-total-items', () => 0)
  const currentPage = computed(() => urlParams.value.page)

  const setTotalItems = (total: number) => {
    totalItems.value = total
  }

  const setPagination = (opts: { currentPage: number, totalItems: number, limit: number }) => {
    totalItems.value = opts.totalItems
    // We don't need to manually update currentPage since it comes from URL
  }

  // ✅ Pagination computed from shared state
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / COURSE_LIMIT) || 1,
  )

  if (import.meta.client) {
    onUnmounted(() => applyFilters.cancel())
  }

  return {
    // Filter
    filter,
    hasActiveFilters,
    categories,
    levels,
    tags,
    instructors,
    applyFilters,
    applyFiltersImmediate,
    resetFilters,

    // Pagination
    currentPage,
    limit: COURSE_LIMIT,
    totalPages,
    pagination: computed(() => ({
      currentPage: currentPage.value,
      totalItems: totalItems.value,
      itemsPerPage: COURSE_LIMIT,
    })),
    hasNextPage: computed(() => currentPage.value < totalPages.value),
    hasPrevPage: computed(() => currentPage.value > 1),
    from: computed(() => (currentPage.value - 1) * COURSE_LIMIT + 1),
    to: computed(() => Math.min(currentPage.value * COURSE_LIMIT, totalItems.value)),
    changePage,
    setTotalItems,
    setPagination,

    // Loading
    loading: optionsLoading,
    error: optionsError,
  }
}
