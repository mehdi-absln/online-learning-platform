import type { ApiResponse } from '~/types/api'
import type { Blog } from '~/types/blog'
import { useApiError } from '~/composables/useApiError'

type BlogResponse = ApiResponse<Blog>

export const useBlog = (slug: string) => {
  const store = useBlogsStore()
  const nuxtApp = useNuxtApp()

  const { data, pending, error, refresh } = useFetch<BlogResponse>(
    `/api/blogs/slug/${slug}`,
    {
      key: `blog-${slug}`,
      getCachedData(key) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
      onResponse({ response }) {
        if (response._data?.success && response._data.data) {
          store.setCurrentBlog(response._data.data)
        }
      },
    },
  )

  const blog = computed(() => data.value?.data ?? store.currentBlog)
  const hasError = useApiError(data, pending, error)

  onUnmounted(() => {
    store.clearCurrentBlog()
  })

  return {
    blog,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
