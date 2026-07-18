import type { DetailedCourse, CourseContentLesson } from '~/types/course'

export const useCoursesStore = defineStore('courses', () => {
  // ───── State ─────
  const detailedCourse = ref<DetailedCourse | null>(null)

  // ───── Lesson Helpers ─────
  const allLessons = computed((): CourseContentLesson[] => {
    if (!detailedCourse.value?.courseContent) return []
    return detailedCourse.value.courseContent.flatMap(
      section => section.content || [],
    )
  })

  const totalLessons = computed(() => allLessons.value.length)

  const allLessonIds = computed(() =>
    allLessons.value
      .map(l => l.id || 0)
      .filter(id => id > 0),
  )

  const findLessonBySlug = (slug: string): CourseContentLesson | null => {
    return allLessons.value.find(l => l.slug === slug) || null
  }

  const findLessonIndex = (slug: string): number => {
    return allLessons.value.findIndex(l => l.slug === slug)
  }

  const findLessonSection = (slug: string) => {
    return detailedCourse.value?.courseContent?.find(s =>
      s.content?.some(l => l.slug === slug),
    ) || null
  }

  // ───── Actions ─────
  const setDetailedCourse = (course: DetailedCourse | null) => {
    detailedCourse.value = course
  }

  return {
    // State
    detailedCourse,

    // Lesson Helpers
    allLessons,
    totalLessons,
    allLessonIds,
    findLessonBySlug,
    findLessonIndex,
    findLessonSection,

    // Actions
    setDetailedCourse,
  }
})
