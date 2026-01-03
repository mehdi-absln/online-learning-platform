import type { LessonProgress } from '~/types/shared/lessons'

export const useLessonProgressStore = defineStore('lesson-progress', () => {
  // ───── State ─────
  const progress = ref<Record<number, LessonProgress>>({})
  const bookmarks = ref<Set<number>>(new Set())
  const notes = ref<Record<number, string>>({})

  // ───── Getters ─────
  const isCompleted = computed(() => (lessonId: number) => {
    return progress.value[lessonId]?.isCompleted ?? false
  })

  const isBookmarked = computed(() => (lessonId: number) => {
    return bookmarks.value.has(lessonId)
  })

  const getNote = computed(() => (lessonId: number) => {
    return notes.value[lessonId] ?? ''
  })

  const completedLessonIds = computed(() => {
    return Object.entries(progress.value)
      .filter(([_, p]) => p.isCompleted)
      .map(([id]) => Number(id))
  })

  const completedCount = computed(() => completedLessonIds.value.length)

  // ───── Actions ─────
  const markComplete = async (lessonId: number) => {
    progress.value[lessonId] = {
      lessonId,
      isCompleted: true,
      isBookmarked: progress.value[lessonId]?.isBookmarked ?? false,
      completedAt: new Date(),
      notes: progress.value[lessonId]?.notes,
      progressPercentage: 100,
    }
    // TODO: API call
  }

  const markIncomplete = async (lessonId: number) => {
    progress.value[lessonId] = {
      lessonId,
      isCompleted: false,
      isBookmarked: progress.value[lessonId]?.isBookmarked ?? false,
      completedAt: undefined,
      notes: progress.value[lessonId]?.notes,
      progressPercentage: 0,
    }
    // TODO: API call
  }

  const toggleComplete = async (lessonId: number) => {
    if (isCompleted.value(lessonId)) {
      await markIncomplete(lessonId)
    }
    else {
      await markComplete(lessonId)
    }
  }

  const toggleBookmark = async (lessonId: number) => {
    const newBookmarks = new Set(bookmarks.value)
    if (newBookmarks.has(lessonId)) {
      newBookmarks.delete(lessonId)
    }
    else {
      newBookmarks.add(lessonId)
    }
    bookmarks.value = newBookmarks
    // TODO: API call
  }

  const saveNote = async (lessonId: number, content: string) => {
    notes.value[lessonId] = content
    // TODO: API call
  }

  const getProgressForCourse = (lessonIds: number[]) => {
    const completed = lessonIds.filter(id => isCompleted.value(id)).length
    return {
      completed,
      total: lessonIds.length,
      percentage: lessonIds.length > 0 ? (completed / lessonIds.length) * 100 : 0,
    }
  }

  return {
    // State
    progress,
    bookmarks,
    notes,

    // Getters
    isCompleted,
    isBookmarked,
    getNote,
    completedLessonIds,
    completedCount,

    // Actions
    markComplete,
    markIncomplete,
    toggleComplete,
    toggleBookmark,
    saveNote,
    getProgressForCourse,
  }
})
