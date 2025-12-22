import { debounce } from 'lodash-es'
import type { CoursesFilter } from '~/types/courses-filter'
import { extractParamsFromUrl, isFilterEqual, updateUrl } from '~/utils/course-helpers'
import type { FilterOptionsResponse } from '~/types/shared/api'

// ──────────────────────────────────────────────────────────────
// Global flags to prevent race conditions & infinite loops
// between URL ↔ Store ↔ Composable updates
// ──────────────────────────────────────────────────────────────
let isUpdatingFromUrl = false
let isUpdatingFromComposable = false
let updateCounter = 0

/**
 * Central filter management composable for course listing pages.
 * Handles two-way sync between:
 *   • URL query params
 *   • Pinia store (coursesStore.currentFilter & currentPage)
 *   • Component state
 *
 * Prevents infinite loops using flags + counter.
 */
export const useCourseFilters = () => {
  const coursesStore = useCoursesStore()
  const route = useRoute()

  // ───── Fetch filter options (categories, levels, tags, instructors) ─────
  const { data: optionsData, pending: optionsLoading, error: optionsError }
    = useFetch<FilterOptionsResponse>('/api/courses/filter-options', {
      key: 'filter-options',
    })

  const categories = computed(() => optionsData.value?.data?.categories || [])
  const levels = computed(() => optionsData.value?.data?.levels || [])
  const tags = computed(() => optionsData.value?.data?.tags || [])
  const instructors = computed(() => optionsData.value?.data?.instructors || [])

  const filter = computed(() => coursesStore.currentFilter)

  // ───── Apply filter + page from URL (used by watcher) ─────
  const applyParamsFromUrl = (newFilter: CoursesFilter, newPage: number) => {
    const currentUpdate = ++updateCounter
    isUpdatingFromUrl = true

    coursesStore.setFilter(newFilter)
    if (newPage !== coursesStore.currentPage) {
      coursesStore.setPage(newPage)
    }

    // Reset flag only for the latest call (prevents race)
    if (import.meta.client) {
      nextTick(() => {
        if (currentUpdate === updateCounter) isUpdatingFromUrl = false
      })
    }
    else {
      isUpdatingFromUrl = false
    }
  }

  // ───── Watch URL changes (both filter & pagination) ─────
  watch(
    () => route.fullPath,
    () => {
      if (isUpdatingFromComposable || isUpdatingFromUrl) return

      const { filter: urlFilter, page } = extractParamsFromUrl(route.query)

      const filterChanged = !isFilterEqual(urlFilter, coursesStore.currentFilter)
      const pageChanged = page !== coursesStore.currentPage

      if (filterChanged || pageChanged) {
        applyParamsFromUrl(urlFilter, page)
      }
    },
    { immediate: true },
  )

  // ───── Debounced filter application (UI interactions) ─────
  const applyFilters = debounce((newFilter: CoursesFilter) => {
    if (isUpdatingFromUrl) return

    isUpdatingFromComposable = true
    coursesStore.setFilter(newFilter)

    if (import.meta.client) {
      updateUrl(newFilter, coursesStore.currentPage, coursesStore.itemsPerPage)
      // Small delay to ensure URL update completes before allowing next sync
      setTimeout(() => {
        isUpdatingFromComposable = false
      },
      100)
    }
  }, 300)

  // ───── Immediate filter apply (e.g. on search submit, filter reset) ─────
  const applyFiltersImmediate = (newFilter?: CoursesFilter) => {
    applyFilters.cancel()
    const filterToApply = newFilter ?? coursesStore.currentFilter

    if (isUpdatingFromUrl) return

    isUpdatingFromComposable = true
    coursesStore.setFilter(filterToApply)

    if (import.meta.client) {
      updateUrl(filterToApply, coursesStore.currentPage, coursesStore.itemsPerPage)
      setTimeout(() => {
        isUpdatingFromComposable = false
      },
      100)
    }
  }

  // ───── Reset all filters ─────
  const resetFilters = () => {
    isUpdatingFromComposable = true
    coursesStore.resetFilter()

    if (import.meta.client) {
      updateUrl({}, 1, coursesStore.itemsPerPage)
      setTimeout(() => {
        isUpdatingFromComposable = false
      },
      100)
    }
  }

  // ───── Pagination handler ─────
  const changePage = (page: number) => {
    if (isUpdatingFromUrl) return

    isUpdatingFromComposable = true
    coursesStore.changePage(page)

    if (import.meta.client) {
      updateUrl(coursesStore.currentFilter, page, coursesStore.itemsPerPage)
      setTimeout(() => {
        isUpdatingFromComposable = false
      },
      100)
    }
  }

  // Cancel pending debounced calls on unmount
  if (import.meta.client) {
    onUnmounted(() => applyFilters.cancel())
  }

  return {
    filter,
    categories,
    levels,
    tags,
    instructors,
    applyFilters,
    applyFiltersImmediate,
    resetFilters,
    changePage,
    loading: optionsLoading,
    error: optionsError,
  }
}
