import type { ApiResponse } from '~/types/api'
import type { Blog } from '~/types/blog'
import { useApiError } from '~/composables/useApiError'

type BlogsResponse = ApiResponse<Blog[]>

export function useBlogs() {
  const route = useRoute()
  const { limit } = useCourseFilters()
  const nuxtApp = useNuxtApp()

  const queryParams = computed(() => ({
    q: route.query.q as string || '',
    page: Number(route.query.page) || 1,
    limit,
  }))

  // Generate unique cache key based on query params (pagination & search)
  const cacheKey = computed(() => `blogs-${route.query.q as string || ''}-${Number(route.query.page) || 1}-${limit}`)

  const { data, pending, error, refresh } = useFetch<BlogsResponse>('/api/blogs', {
    key: cacheKey,
    query: queryParams,
    // Client-side cache
    getCachedData(key) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })

  const hasError = useApiError(data, pending, error)

  const blogs = computed(() => data.value?.data ?? [])
  const totalItems = computed(() => data.value?.pagination?.totalItems ?? 0)

  return {
    blogs,
    totalItems,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
