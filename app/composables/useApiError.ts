import type { Ref } from 'vue'
import type { FetchError } from 'ofetch'

interface ApiResponse {
  success?: boolean
}

export const useApiError = <T extends ApiResponse>(
  data: Ref<T | null | undefined>,
  pending: Ref<boolean>,
  error: Ref<FetchError | undefined>
) => {
  const hasError = computed(() => {
    if (error.value) return true
    return !!(!pending.value && data.value && !data.value.success)
  })

  return hasError
}