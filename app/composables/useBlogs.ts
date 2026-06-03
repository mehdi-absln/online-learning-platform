import type { ApiResponse } from '~/types/api'; import type { Blog } from '~/types/blog'; type BlogsResponse = ApiResponse<Blog[]>
import { useApiError } from '~/composables/useApiError'

export function useBlogs() {
  const route = useRoute()
  const store = useBlogsStore()
  const { setTotalItems, limit } = useBlogFilters()

  const queryParams = computed(() => ({
    q: route.query.q as string || '',
    page: Number(route.query.page) || 1,
    limit,
  }))

  const { data, pending, error, refresh } = useFetch<BlogsResponse>('/api/blogs', {
    query: queryParams,
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
