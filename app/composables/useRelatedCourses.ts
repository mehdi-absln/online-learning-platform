import type { Course } from '~/types/shared/courses'

interface RelatedCoursesResponse {
  success: boolean
  data: Course[]
  meta: {
    total: number
    basedOn: {
      categoryId: string | null
      tagIds: string[]
    }
  }
}

interface UseRelatedCoursesOptions {
  immediate?: boolean
}

/**
 * Composable for fetching and managing related courses data
 * Provides reactive state for related courses, loading status, and error handling
 *
 * @param courseId - The ID of the current course to find related courses for
 * @param options - Configuration options for the composable
 * @returns Reactive properties and actions for related courses management
 */
export const useRelatedCourses = (
  courseId: MaybeRef<string | null | undefined>,
  options: UseRelatedCoursesOptions = {},
) => {
  const { immediate = true } = options

  // Resolve the courseId ref to a raw value
  const resolvedCourseId = computed(() => toValue(courseId))

  // Fetch related courses from API with caching
  const {
    data,
    pending,
    error,
    status,
  } = useFetch<RelatedCoursesResponse>(
    () => `/api/courses/${resolvedCourseId.value}/related`,
    {
      key: () => `related-courses-${resolvedCourseId.value}`,
      immediate: immediate && !!resolvedCourseId.value,
      watch: [resolvedCourseId],
      default: () => ({
        success: false,
        data: [],
        meta: { total: 0, basedOn: { categoryId: null, tagIds: [] } },
      }),
    },
  )

  // Rename pending to loading for public API to maintain consistent naming
  const loading = pending

  // Computed property to extract related courses from the API response
  const relatedCourses = computed(() =>
    data.value?.data || [],
  )

  // Computed property to get the total count of related courses
  const totalRelated = computed(() => data.value?.meta?.total || 0)

  // Computed property to check if there are any related courses
  const hasRelatedCourses = computed(() => relatedCourses.value.length > 0)

  // Computed property to determine if there's an error using the standardized error composable
  const hasError = useApiError(data, pending, error)

  // Computed property to get the error message from either fetch error or API response error
  const errorMessage = computed(() => error.value?.message || hasError.value?.message || null)

  return {
    // Data properties
    relatedCourses,
    totalRelated,
    hasRelatedCourses,

    // State properties
    loading,
    status,

    // Error properties
    error,
    hasError,
    errorMessage,
  }
}
