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
    isLoading.value = true
    error.value = null

    try {
      const url = `/api/courses/${courseSlug.value}/lessons/${lessonSlug.value}`
      console.log('🔵 [useLessonAccess] Fetching:', url, {
        courseSlug: courseSlug.value,
        lessonSlug: lessonSlug.value,
      })

      const response = await $fetch<{
        success: boolean
        data: {
          currentLesson: LessonAccessData
        }
        hasAccess: boolean
      }>(url, {
        credentials: 'include',
      })

      console.log('🟢 [useLessonAccess] Response received:', {
        success: response.success,
        hasAccess: response.hasAccess,
        isLocked: response.data?.currentLesson?.isLocked,
        lessonTitle: response.data?.currentLesson?.title,
      })

      if (response.success && response.data?.currentLesson) {
        lessonData.value = response.data.currentLesson
      }
    }
    catch (err: unknown) {
      console.error('🔴 [useLessonAccess] Failed to fetch lesson access:', err)
      console.error('🔴 Error details:', {
        message: (err as Error)?.message,
        statusCode: (err as any)?.statusCode,
        statusMessage: (err as any)?.statusMessage,
        data: (err as any)?.data,
      })
      error.value = (err as any)?.statusMessage || 'Failed to load lesson details'
    }
    finally {
      isLoading.value = false
      console.log('[useLessonAccess] Loading complete', {
        lessonData: lessonData.value,
        error: error.value,
      })
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
