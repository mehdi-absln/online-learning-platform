import { debounce } from 'lodash-es'
import type { ExtendedCoursesFilter } from '~/types/courses-filter'
import { extractFilterFromUrl, mergeFilters } from '~/utils/course-helpers'
import type { FilterOptionsResponse } from '~/types/shared/api'

export const useCourseFilters = () => {
  const coursesStore = useCoursesStore()
  const route = useRoute()

  // Filter options with useFetch
  const { data: optionsData, pending: optionsLoading, error: optionsError } = useFetch<FilterOptionsResponse>(
    '/api/courses/filter-options',
    { key: 'filter-options' },
  )

  const categories = computed(() => optionsData.value?.data?.categories || [])
  const levels = computed(() => optionsData.value?.data?.levels || [])
  const tags = computed(() => optionsData.value?.data?.tags || [])
  const instructors = computed(() => optionsData.value?.data?.instructors || [])

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
      priceFilter: 'all',
      freeOnly: false,
      paidOnly: false,
      searchQuery: '',
      instructorId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    }

    coursesStore.resetFilter()
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
    { immediate: true },
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
        priceFilter: newStoreFilter.priceFilter || 'all',
        searchQuery: newStoreFilter.searchQuery || '',
        instructorId: newStoreFilter.instructorId,
        minPrice: newStoreFilter.minPrice,
        maxPrice: newStoreFilter.maxPrice,
      }
    },
    { deep: true },
  )

  return {
    filter,
    categories,
    levels,
    tags,
    instructors,
    applyFilters,
    resetFilters,
    loading: optionsLoading,
    error: optionsError,
  }
}
