import { debounce } from 'lodash-es'
import type { ExtendedCoursesFilter } from '~/types/courses-filter'
import { extractFilterFromUrl, mergeFilters } from '~/utils/course-helpers'

// Define the composable for fetching filter options
export const useFetchFilterOptions = () => {
  const filterOptions = ref({
    categories: [] as string[],
    levels: [] as string[],
    tags: [] as string[],
    instructors: [] as { id: number; name: string }[]
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFilterOptions = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<import('~/types/shared/api').FilterOptionsResponse>(
        '/api/courses/filter-options'
      )
      if (response.success) {
        filterOptions.value = {
          categories: response.data?.categories || [],
          levels: response.data?.levels || [],
          tags: response.data?.tags || [],
          instructors: response.data?.instructors || []
        }
      } else {
        error.value = 'Failed to fetch filter options'
      }
    } catch (err: unknown) {
      const apiResponse = err as { data?: { message?: string } }
      error.value =
        apiResponse.data?.message ||
        (err as Error)?.message ||
        'An error occurred while fetching filter options'
    } finally {
      loading.value = false
    }
  }

  return {
    filterOptions: readonly(filterOptions),
    loading: readonly(loading),
    error: readonly(error),
    fetchFilterOptions
  }
}

export const useCourseFilters = () => {
  const coursesStore = useCoursesStore()
  const route = useRoute()
  const { filterOptions, loading, error, fetchFilterOptions } = useFetchFilterOptions()

  // Initialize filter from store and URL
  const initializeFilter = (): ExtendedCoursesFilter => {
    const urlFilter = extractFilterFromUrl(route.query)
    return mergeFilters(coursesStore.currentFilter, urlFilter)
  }

  // Reactive filter
  const filter = ref<ExtendedCoursesFilter>(initializeFilter())

  // Apply filters with debounce
  const applyFilters = debounce(() => {
    coursesStore.applyFilter(filter.value)
  }, 300)

  // Reset filters
  const resetFilters = () => {
    filter.value = {
      categories: [],
      levels: [],
      tags: [],
      freeOnly: false,
      paidOnly: false,
      searchQuery: '',
      instructorId: undefined,
      minPrice: undefined,
      maxPrice: undefined
    }

    coursesStore.resetFilter()
  }

  // Toggle exclusive boolean filters (freeOnly and paidOnly)
  const toggleExclusiveFilter = (
    filterName: keyof ExtendedCoursesFilter,
    oppositeFilterName: keyof ExtendedCoursesFilter
  ) => {
    if (filter.value[filterName] && filter.value[oppositeFilterName]) {
      filter.value[oppositeFilterName] = false
    }
    applyFilters()
  }

  // Watch for changes in route and update filter accordingly
  watch(
    () => route.fullPath,
    () => {
      // Only update if the filter has actually changed
      const newFilter = initializeFilter()
      if (JSON.stringify(newFilter) !== JSON.stringify(filter.value)) {
        filter.value = newFilter
      }
    },
    { immediate: true }
  )

  // Watch for changes in store filter and update local filter
  watch(
    () => coursesStore.currentFilter,
    (newStoreFilter) => {
      // Update only the base filter properties, keep extended properties intact
      filter.value = {
        ...filter.value,
        categories: newStoreFilter.categories || [],
        levels: newStoreFilter.levels || [],
        tags: newStoreFilter.tags || [],
        freeOnly: newStoreFilter.freeOnly || false,
        paidOnly: newStoreFilter.paidOnly || false,
        searchQuery: newStoreFilter.searchQuery || '',
        instructorId: newStoreFilter.instructorId,
        minPrice: newStoreFilter.minPrice,
        maxPrice: newStoreFilter.maxPrice,
        ...newStoreFilter
      }
    },
    { deep: true }
  )

  // Extract filter from URL when component is mounted
  onMounted(() => {
    const urlFilter = extractFilterFromUrl(route.query)
    if (Object.keys(urlFilter).length > 0) {
      coursesStore.applyFilter(urlFilter)
    }
  })

  return {
    filter,
    categories: computed(() => filterOptions.value.categories),
    levels: computed(() => filterOptions.value.levels),
    tags: computed(() => filterOptions.value.tags),
    instructors: computed(() => filterOptions.value.instructors),
    applyFilters,
    resetFilters,
    toggleExclusiveFilter,
    fetchFilterOptions,
    loading,
    error
  }
}
