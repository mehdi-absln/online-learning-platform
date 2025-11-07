// Composable to manage course filter options
import type { FilterOptions, FilterOptionsResponse } from '~/types/filter-options'

export const useCourseFilters = () => {
  const categories = ref<string[]>([])
  const levels = ref<string[]>([])
  const tags = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Function to fetch filter options from API
  const fetchFilterOptions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<FilterOptionsResponse>('/api/courses/filters/options')
      
      if (response.success) {
        categories.value = response.data.categories
        levels.value = response.data.levels
        tags.value = response.data.tags
      } else {
        throw new Error(response.message || 'Failed to fetch filter options')
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || 'An error occurred while fetching filter options'
      console.error('Error fetching filter options:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    categories: readonly(categories),
    levels: readonly(levels),
    tags: readonly(tags),
    loading: readonly(loading),
    error: readonly(error),
    fetchFilterOptions
  }
}