import type { ApiResponse } from '~/types/api'
import type { Blog } from '~/types/blog'
import { useApiError } from '~/composables/useApiError'

type BlogsResponse = ApiResponse<Blog[]>

export function useBlogs() {
  const route = useRoute()
  const store = useBlogsStore()
  const { setTotalItems, limit } = useBlogFilters()
  const nuxtApp = useNuxtApp()

  const queryParams = computed(() => ({
    q: route.query.q as string || '',
    page: Number(route.query.page) || 1,
    limit,
  }))

  // Generate unique cache key based on query params (pagination & search)
  const cacheKey = computed(() => {
    const params = queryParams.value
    return `blogs-${JSON.stringify(params)}`
  })

  const { data, pending, error, refresh } = useFetch<BlogsResponse>('/api/blogs', {
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
    onResponse({ response }) {
      if (response._data?.success) {
        store.setBlogs(response._data.data)
        if (response._data.pagination?.totalItems) {
          setTotalItems(response._data.pagination.totalItems)
        }
      }
    },
  })

  const hasError = useApiError(data, pending, error)

  const blogs = computed(() => data.value?.data ?? store.blogs)

  return {
    blogs,
    totalItems: computed(() => data.value?.pagination?.totalItems ?? 0),
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
