import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue, watch } from '#imports'

interface LessonAccessData {
  id: number
  title: string
  slug: string
  description: string | null
  duration: string | null
  isFree: boolean
  isLocked: boolean
  videoUrl: string | null
  content: string | null
  createdAt: string | Date | null
  updatedAt: string | Date | null
}

interface LessonAccessResponse {
  success: boolean
  data: {
    currentLesson: LessonAccessData
  }
  hasAccess: boolean
}

export const useLessonAccess = (
  courseSlug: MaybeRefOrGetter<string>,
  lessonSlug: MaybeRefOrGetter<string>,
) => {
  const normalizeSlug = (value: string | null | undefined) => value?.trim().toLowerCase() ?? ''
  const courseSlugValue = computed(() => toValue(courseSlug))
  const lessonSlugValue = computed(() => toValue(lessonSlug))
  const normalizedCourseSlug = computed(() => normalizeSlug(courseSlugValue.value))
  const normalizedLessonSlug = computed(() => normalizeSlug(lessonSlugValue.value))
  const fetchKey = computed(
    () => `lesson-access:${normalizedCourseSlug.value}:${normalizedLessonSlug.value}`,
  )

  const { data, pending, error, refresh, clear } = useFetch<LessonAccessResponse>(
    () => `/api/course-by-slug/${normalizedCourseSlug.value}/lessons/${normalizedLessonSlug.value}`,
    {
      key: fetchKey,
      default: () => null,
      dedupe: 'cancel',
      immediate: true,
      watch: [normalizedCourseSlug, normalizedLessonSlug],
      credentials: 'include',
      server: true,
    },
  )

  watch([normalizedCourseSlug, normalizedLessonSlug], ([newCourseSlug, newLessonSlug], [oldCourseSlug, oldLessonSlug]) => {
    if (!oldCourseSlug && !oldLessonSlug) return
    if (newCourseSlug !== oldCourseSlug || newLessonSlug !== oldLessonSlug) {
      clear()
    }
  })

  const lessonData = computed(() => {
    const currentLesson = data.value?.data?.currentLesson
    if (!currentLesson) return null

    return normalizeSlug(currentLesson.slug) === normalizedLessonSlug.value
      ? currentLesson
      : null
  })

  const normalizedError = computed(() => {
    const err = error.value as { statusMessage?: string } | null
    return err?.statusMessage || null
  })

  return {
    lessonData,
    isLoading: pending,
    error: normalizedError,
    fetchLessonAccess: refresh,
  }
}
