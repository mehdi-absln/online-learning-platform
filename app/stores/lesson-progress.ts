import type { LessonProgress } from '~/types/shared/lessons'

// ───── API Response Types ─────
interface ProgressResponse {
  success: boolean
  data?: {
    progress: LessonProgress[]
  }
}

interface SingleProgressResponse {
  success: boolean
  data?: {
    progress: LessonProgress
  }
}

interface ProgressState {
  lessonId: number
  isCompleted: boolean
  isBookmarked: boolean
  completedAt?: Date
  notes?: string
  progressPercentage: number
}

export const useLessonProgressStore = defineStore('lesson-progress', () => {
  // ───── State ─────
  const progress = ref<Record<number, LessonProgress>>({})
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // ───── Getters ─────
  const isCompleted = (lessonId: number) => progress.value[lessonId]?.isCompleted ?? false
  const isBookmarked = (lessonId: number) => progress.value[lessonId]?.isBookmarked ?? false
  const getNote = (lessonId: number) => progress.value[lessonId]?.notes ?? ''

  const completedLessonIds = computed(() =>
    Object.entries(progress.value)
      .filter(([_, p]) => p.isCompleted)
      .map(([id]) => Number(id)),
  )

  const completedCount = computed(() => completedLessonIds.value.length)

  // ───── Helpers ─────
  const getDefaultProgress = (lessonId: number): ProgressState => ({
    lessonId,
    isCompleted: false,
    isBookmarked: false,
    progressPercentage: 0,
  })

  const updateLocal = (lessonId: number, updates: Partial<ProgressState>) => {
    const current = progress.value[lessonId] ?? getDefaultProgress(lessonId)
    progress.value[lessonId] = { ...current, ...updates }
  }

  const removeLocal = (lessonId: number) => {
    const { [lessonId]: _, ...rest } = progress.value
    progress.value = rest
  }

  const revertLocal = (lessonId: number, previous?: LessonProgress) => {
    if (previous) {
      progress.value[lessonId] = previous
    }
    else {
      removeLocal(lessonId)
    }
  }

  // ───── Actions ─────
  const fetchProgress = async () => {
    if (isInitialized.value) return

    isLoading.value = true

    try {
      const res = await $fetch<ProgressResponse>('/api/progress')

      if (res?.success && res.data?.progress) {
        progress.value = res.data.progress.reduce(
          (acc, p) => {
            acc[p.lessonId] = p
            return acc
          },
          {} as Record<number, LessonProgress>,
        )
      }

      isInitialized.value = true
    }
    catch (error) {
      console.error('Failed to fetch progress:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  const toggleComplete = async (lessonId: number) => {
    const current = progress.value[lessonId]
    const newValue = !current?.isCompleted

    updateLocal(lessonId, {
      isCompleted: newValue,
      completedAt: newValue ? new Date() : undefined,
      progressPercentage: newValue ? 100 : 0,
    })

    try {
      const res = await $fetch<SingleProgressResponse>('/api/progress/complete', {
        method: 'POST',
        body: { lessonId },
      })

      if (res.success && res.data?.progress) {
        progress.value[lessonId] = res.data.progress
      }
    }
    catch {
      revertLocal(lessonId, current)
    }
  }

  const toggleBookmark = async (lessonId: number) => {
    const current = progress.value[lessonId]

    updateLocal(lessonId, { isBookmarked: !current?.isBookmarked })

    try {
      const res = await $fetch<SingleProgressResponse>('/api/progress/bookmark', {
        method: 'POST',
        body: { lessonId },
      })

      if (res.success && res.data?.progress) {
        progress.value[lessonId] = res.data.progress
      }
    }
    catch {
      revertLocal(lessonId, current)
    }
  }

  const saveNote = async (lessonId: number, notes: string) => {
    const current = progress.value[lessonId]

    updateLocal(lessonId, { notes })

    try {
      const res = await $fetch<SingleProgressResponse>('/api/progress/notes', {
        method: 'POST',
        body: { lessonId, notes },
      })

      if (res.success && res.data?.progress) {
        progress.value[lessonId] = res.data.progress
      }
    }
    catch {
      revertLocal(lessonId, current)
    }
  }

  const getProgressForCourse = (lessonIds: number[]) => {
    const completed = lessonIds.filter(id => isCompleted(id)).length
    const total = lessonIds.length

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    }
  }

  const reset = () => {
    progress.value = {}
    isInitialized.value = false
  }

  return {
    progress,
    isLoading,
    isInitialized,
    isCompleted,
    isBookmarked,
    getNote,
    completedLessonIds,
    completedCount,
    fetchProgress,
    toggleComplete,
    toggleBookmark,
    saveNote,
    getProgressForCourse,
    reset,
  }
})
