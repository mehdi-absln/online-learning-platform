import type { DetailedLesson } from '~/types/lesson'
import type { CourseContentLesson } from '~/types/course'
import { useUserStore } from '~/stores/user'

export const useLesson = (
  courseSlug: MaybeRef<string>,
  lessonSlug: MaybeRef<string>,
) => {
  const router = useRouter()

  // ───── Reactive Values ─────
  const courseSlugValue = computed(() => toValue(courseSlug))
  const lessonSlugValue = computed(() => toValue(lessonSlug))

  // ───── Stores ─────
  const coursesStore = useCoursesStore()
  const progressStore = useLessonProgressStore()

  // ───── Course Data ─────
  const { course, isLoading, error: courseError } = useCourse(courseSlugValue.value)

  // ───── Current Lesson ─────
  const currentIndex = computed(() =>
    coursesStore.findLessonIndex(lessonSlugValue.value),
  )

  const lesson = computed((): DetailedLesson | null => {
    const found = coursesStore.findLessonBySlug(lessonSlugValue.value)
    if (!found) return null

    const section = coursesStore.findLessonSection(lessonSlugValue.value)

    return {
      ...found,
      id: found.id || 0,
      courseId: course.value?.id || 0,
      content: found.description || '',
      sectionId: section?.id || 0,
      order: currentIndex.value || 0,
    } as DetailedLesson
  })

  // ───── Navigation ─────
  const totalLessons = computed(() => coursesStore.totalLessons)

  const prevLesson = computed(() =>
    currentIndex.value > 0
      ? coursesStore.allLessons[currentIndex.value - 1]
      : null,
  )

  const nextLesson = computed(() =>
    currentIndex.value < totalLessons.value - 1
      ? coursesStore.allLessons[currentIndex.value + 1]
      : null,
  )

  // Helper to check if a lesson is accessible (free or user is enrolled)
  const userStore = useUserStore()
  const courseId = computed(() => course.value?.id || 0)
  const isLessonAccessible = (targetLesson: CourseContentLesson | null) => {
    if (!targetLesson) return false
    return targetLesson.isFree || userStore.isEnrolled(courseId.value)
  }

  const isNextLessonAccessible = computed(() => isLessonAccessible(nextLesson.value ?? null))

  const progressPercentage = computed(() =>
    totalLessons.value > 0
      ? ((currentIndex.value + 1) / totalLessons.value) * 100
      : 0,
  )

  // ───── Error ─────
  const error = computed(() => {
    if (courseError.value) return String(courseError.value)
    if (!isLoading.value && !lesson.value) return 'Lesson not found'
    return null
  })

  // ───── Progress ─────
  const isLessonCompleted = computed(() =>
    lesson.value ? progressStore.isCompleted(lesson.value.id) : false,
  )

  const isLessonBookmarked = computed(() =>
    lesson.value ? progressStore.isBookmarked(lesson.value.id) : false,
  )

  const lessonNotes = computed(() =>
    lesson.value ? progressStore.getNote(lesson.value.id) : '',
  )

  const courseProgress = computed(() =>
    progressStore.getProgressForCourse(coursesStore.allLessonIds),
  )

  // ───── Breadcrumbs ─────
  const breadcrumbs = computed(() => [
    { name: 'Courses', path: '/courses' },
    { name: course.value?.title || '...', path: `/courses/${courseSlugValue.value}` },
    { name: lesson.value?.title || '...', path: '#' },
  ])

  // ───── Actions ─────
  const goToPrev = () => {
    if (prevLesson.value) {
      router.push(`/courses/${courseSlugValue.value}/lessons/${prevLesson.value.slug}`)
    }
  }

  const goToNext = () => {
    if (nextLesson.value && isNextLessonAccessible.value) {
      router.push(`/courses/${courseSlugValue.value}/lessons/${nextLesson.value.slug}`)
    }
  }

  const toggleComplete = async () => {
    if (lesson.value) {
      await progressStore.toggleComplete(lesson.value.id)
    }
  }

  const toggleBookmark = async () => {
    if (lesson.value) {
      await progressStore.toggleBookmark(lesson.value.id)
    }
  }

  const saveNotes = async (content: string) => {
    if (lesson.value) {
      await progressStore.saveNote(lesson.value.id, content)
    }
  }

  const shareLesson = async () => {
    const url = window.location.href
    const title = lesson.value?.title || 'Lesson'

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      }
      catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }
    else {
      await navigator.clipboard.writeText(url)
    }
  }

  return {
    // Data
    course,
    lesson,
    courseId,

    // Loading & Error
    isLoading,
    error,

    // Navigation
    currentIndex,
    totalLessons,
    prevLesson,
    nextLesson,
    isNextLessonAccessible,
    progressPercentage,
    breadcrumbs,
    goToPrev,
    goToNext,

    // Progress
    isLessonCompleted,
    isLessonBookmarked,
    lessonNotes,
    courseProgress,

    // Actions
    toggleComplete,
    toggleBookmark,
    saveNotes,
    shareLesson,
  }
}
