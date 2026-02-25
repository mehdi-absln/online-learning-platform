import type { Ref } from 'vue'

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
}

export const useLessonAccess = (courseSlug: Ref<string>, lessonSlug: Ref<string>) => {
  const lessonData = ref<LessonAccessData | null>(null)
  const isLoading = ref(true) // ✅ Start as true to prevent race condition
  const error = ref<string | null>(null)

  const fetchLessonAccess = async () => {
    // Guard: Don't fetch if slugs are empty
    if (!courseSlug.value || !lessonSlug.value) {
      lessonData.value = null
      isLoading.value = false
      error.value = null
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const url = `/api/courses/${courseSlug.value}/lessons/${lessonSlug.value}`

      const response = await $fetch<{
        success: boolean
        data: {
          currentLesson: LessonAccessData
        }
        hasAccess: boolean
      }>(url, {
        credentials: 'include',
      })

      if (response.success && response.data?.currentLesson) {
        lessonData.value = response.data.currentLesson
      }
    }
    catch (err: unknown) {
      const errorInfo = err as { statusCode?: number, statusMessage?: string, data?: unknown }
      error.value = errorInfo?.statusMessage || 'Failed to load lesson details'
    }
    finally {
      isLoading.value = false
    }
  }

  // Fetch immediately on initialization (not just onMounted)
  // Only run on client - server can't access cookies properly
  if (import.meta.client) {
    watch([courseSlug, lessonSlug], () => {
      fetchLessonAccess()
    }, { immediate: true }) // ✅ Fetch immediately when composable is used
  }

  return {
    lessonData,
    isLoading,
    error,
    fetchLessonAccess,
  }
}
