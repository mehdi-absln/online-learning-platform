import type { ApiResponse } from '~/types/api'
import type { Blog } from '~/types/blog'
import { useApiError } from '~/composables/useApiError'

type BlogResponse = ApiResponse<Blog>

export const useBlog = (slug: string) => {
  const nuxtApp = useNuxtApp()

  const { data, pending, error, refresh } = useFetch<BlogResponse>(
    `/api/blogs/slug/${slug}`,
    {
      key: `blog-${slug}`,
      getCachedData(key) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
    },
  )

  const blog = computed(() => data.value?.data ?? null)
  const hasError = useApiError(data, pending, error)

  return {
    blog,
    isLoading: pending,
    error: hasError,
    refresh,
  }
}
