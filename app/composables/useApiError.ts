import type { Ref } from 'vue'

interface ApiResponse {
  success?: boolean
}

export const useApiError = <T extends ApiResponse>(
  data: Ref<T | null | undefined>,
  pending: Ref<boolean>,
  error: Ref<any>
) => {
  const hasError = computed(() => {
    if (error.value) return true
    return !!(!pending.value && data.value && !data.value.success)
  })

  return hasError
}