import type { Ref } from 'vue'
import type { FetchError } from 'ofetch'

interface ApiResponse {
  success?: boolean
  message?: string
}

export const useApiError = <T extends ApiResponse>(
  data: Ref<T | null | undefined>,
  pending: Ref<boolean>,
  error: Ref<FetchError | undefined>,
) => {
  return computed(() => {
    // Check for fetch errors
    if (error.value) {
      return error.value
    }

    // Check for API response errors
    if (!pending.value && data.value && !data.value.success) {
      return new Error(data.value.message || 'Unknown error')
    }

    return null
  })
}
