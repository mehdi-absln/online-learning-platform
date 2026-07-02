import type { ApiResponse } from '~/types/api'
import type { DetailedCourse } from '~/types/course'
import { useApiError } from '~/composables/useApiError'
import { useCoursesStore } from '~/stores/courses'
import { computed, toValue, watch } from '#imports'

type CourseDetailResponse = ApiResponse<DetailedCourse>

/**
 * Fetch single course by slug with perfect two-way sync to Pinia store.
 * Ensures:
 *   • Fresh data from API always wins
 *   • Store stays updated even on navigation/back-forward
 *   • Component always has latest course (data → store fallback)
 */

export const useCourse = (slug: MaybeRefOrGetter<string>) => {
  const coursesStore = useCoursesStore()
  const normalizeSlug = (value: string | null | undefined) => value?.trim().toLowerCase() ?? ''
  const slugValue = computed(() => toValue(slug))
  const normalizedSlug = computed(() => normalizeSlug(slugValue.value))
  const fetchKey = computed(() => `course:${normalizedSlug.value}`)

  const { data, pending, error, refresh, clear } = useFetch<CourseDetailResponse>(
    () => `/api/course-by-slug/${normalizedSlug.value}`,
    {
      key: fetchKey,
      default: (): CourseDetailResponse => ({ success: false }),
      dedupe: 'cancel',
      watch: [normalizedSlug],
      immediate: true,
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
      transform: (response: CourseDetailResponse): CourseDetailResponse => {
        if (response.success && response.data) {
          coursesStore.setDetailedCourse(response.data)
        }
        return response
      },
    },
  )

  watch(data, (newData) => {
    if (newData?.success && newData.data) {
      coursesStore.setDetailedCourse(newData.data)
    }
  }, { immediate: true })

  // Clear stale data on route change
  watch(normalizedSlug, (newSlug, oldSlug) => {
    if (oldSlug && newSlug !== oldSlug) {
      clear()
      coursesStore.setDetailedCourse(null)
    }
  })

  const fetchedCourse = computed(() => data.value?.success ? data.value.data : null)
  const course = computed(() => {
    if (normalizeSlug(fetchedCourse.value?.slug) === normalizedSlug.value) {
      return fetchedCourse.value
    }

    if (normalizeSlug(coursesStore.detailedCourse?.slug) === normalizedSlug.value) {
      return coursesStore.detailedCourse
    }

    return null
  })
  const hasError = useApiError(data, pending, error)

  return { course, isLoading: pending, error: hasError, refresh }
}
