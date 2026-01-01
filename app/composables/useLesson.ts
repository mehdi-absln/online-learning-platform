import type { Lesson, LessonProgress } from '~/types/shared/lessons'

/**
 * Composable for managing lesson-related state and operations
 */
export const useLesson = () => {
  // State for tracking lesson progress
  const lessonProgress = useState<Record<number, LessonProgress>>('lesson-progress', () => ({}))

  // State for user notes
  const userNotes = useState<Record<number, string>>('user-notes', () => ({}))

  // State for bookmarks
  const bookmarks = useState<number[]>('lesson-bookmarks', () => [])

  /**
   * Mark a lesson as completed
   */
  const markLessonComplete = async (lessonId: number) => {
    // Update local state
    lessonProgress.value = {
      ...lessonProgress.value,
      [lessonId]: {
        ...lessonProgress.value[lessonId],
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    }

    // TODO: API call to save progress
    console.log(`Lesson ${lessonId} marked as completed`)
  }

  /**
   * Mark a lesson as incomplete
   */
  const markLessonIncomplete = async (lessonId: number) => {
    // Update local state
    lessonProgress.value = {
      ...lessonProgress.value,
      [lessonId]: {
        ...lessonProgress.value[lessonId],
        lessonId,
        isCompleted: false,
        completedAt: undefined,
      },
    }

    // TODO: API call to save progress
    console.log(`Lesson ${lessonId} marked as incomplete`)
  }

  /**
   * Toggle lesson bookmark
   */
  const toggleBookmark = async (lessonId: number) => {
    const isBookmarked = bookmarks.value.includes(lessonId)

    if (isBookmarked) {
      bookmarks.value = bookmarks.value.filter(id => id !== lessonId)
    }
    else {
      bookmarks.value = [...bookmarks.value, lessonId]
    }

    // Update progress state as well
    lessonProgress.value = {
      ...lessonProgress.value,
      [lessonId]: {
        ...lessonProgress.value[lessonId],
        lessonId,
        isBookmarked: !isBookmarked,
      },
    }

    // TODO: API call to save bookmark
    console.log(`Bookmark ${isBookmarked ? 'removed from' : 'added to'} lesson ${lessonId}`)
  }

  /**
   * Save user notes for a lesson
   */
  const saveNotes = async (lessonId: number, notes: string) => {
    userNotes.value = {
      ...userNotes.value,
      [lessonId]: notes,
    }

    // Update progress state as well
    lessonProgress.value = {
      ...lessonProgress.value,
      [lessonId]: {
        ...lessonProgress.value[lessonId],
        lessonId,
        notes,
      },
    }

    // TODO: API call to save notes
    console.log(`Notes saved for lesson ${lessonId}`)
  }

  /**
   * Get progress for a specific lesson
   */
  const getLessonProgress = (lessonId: number) => {
    return lessonProgress.value[lessonId] || {
      lessonId,
      isCompleted: false,
      isBookmarked: bookmarks.value.includes(lessonId),
      notes: userNotes.value[lessonId] || '',
    }
  }

  /**
   * Get completion status for a lesson
   */
  const isLessonCompleted = (lessonId: number) => {
    return lessonProgress.value[lessonId]?.isCompleted || false
  }

  /**
   * Get bookmark status for a lesson
   */
  const isLessonBookmarked = (lessonId: number) => {
    return bookmarks.value.includes(lessonId)
      || lessonProgress.value[lessonId]?.isBookmarked || false
  }

  /**
   * Get notes for a lesson
   */
  const getLessonNotes = (lessonId: number) => {
    return userNotes.value[lessonId]
      || lessonProgress.value[lessonId]?.notes || ''
  }

  return {
    lessonProgress,
    userNotes,
    bookmarks,
    markLessonComplete,
    markLessonIncomplete,
    toggleBookmark,
    saveNotes,
    getLessonProgress,
    isLessonCompleted,
    isLessonBookmarked,
    getLessonNotes,
  }
}
