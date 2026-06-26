import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

// ───── Import AFTER all mocks ─────
import { useLesson } from '~/composables/useLesson'

// ───── Mock Data ─────
const mockLessons = [
  { id: 1, title: 'Lesson 1', slug: 'lesson-1', duration: '10:00', description: 'Lesson 1 content', isFree: true },
  { id: 2, title: 'Lesson 2', slug: 'lesson-2', duration: '15:00', description: 'Lesson 2 content', isFree: true },
  { id: 3, title: 'Lesson 3', slug: 'lesson-3', duration: '20:00', description: 'Lesson 3 content', isFree: true },
]

const mockCourse = {
  id: 1,
  title: 'Vue.js Course',
  slug: 'vue-course',
  courseContent: [
    { id: 1, title: 'Section 1', content: mockLessons },
  ],
}

// ───── Mock Router - باید قبل از همه باشد ─────
const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => ({
    params: {},
  }),
}))

// Mock Nuxt's #app auto-imports
vi.mock('#app', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Nuxt's auto-imports for useNuxtApp, navigateTo, etc.
vi.mock('#imports', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('#app/composables/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => ({
    params: {},
  }),
}))

// ───── Mock Stores ─────
const mockCoursesStoreData = {
  detailedCourse: mockCourse,
  allLessons: mockLessons,
  totalLessons: 3,
  allLessonIds: [1, 2, 3],
}

vi.mock('~/stores/user', () => ({
  useUserStore: () => ({
    user: null,
    isAuthenticated: false,
    isEnrolled: () => false,
    isAdminLike: false,
  }),
}))

vi.mock('~/stores/courses', () => ({
  useCoursesStore: () => ({
    ...mockCoursesStoreData,
    findLessonIndex: (slug: string) => mockLessons.findIndex(l => l.slug === slug),
    findLessonBySlug: (slug: string) => mockLessons.find(l => l.slug === slug) || null,
    findLessonSection: () => ({ id: 1, title: 'Section 1' }),
  }),
}))

let mockProgressData: Record<number, any> = {}

vi.mock('~/stores/lesson-progress', () => ({
  useLessonProgressStore: () => ({
    progress: mockProgressData,
    isCompleted: (id: number) => mockProgressData[id]?.isCompleted || false,
    isBookmarked: (id: number) => mockProgressData[id]?.isBookmarked || false,
    getNote: () => '',
    getProgressForCourse: (lessonIds: number[]) => {
      const completed = lessonIds.filter(id => mockProgressData[id]?.isCompleted).length
      const total = lessonIds.length
      return {
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      }
    },
    toggleComplete: vi.fn(),
    toggleBookmark: vi.fn(),
    saveNote: vi.fn(),
  }),
}))

vi.mock('~/composables/useCourse', () => ({
  useCourse: () => ({
    course: ref(mockCourse),
    isLoading: ref(false),
    error: ref(null),
  }),
}))

describe('useLesson', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockClear()
    mockProgressData = {}
  })

  // ═══════════════════════════════════════
  // Lesson Data
  // ═══════════════════════════════════════
  describe('lesson data', () => {
    it('should return current lesson based on slug', () => {
      const { lesson } = useLesson('vue-course', 'lesson-2')

      expect(lesson.value?.title).toBe('Lesson 2')
      expect(lesson.value?.slug).toBe('lesson-2')
    })

    it('should return null for non-existent lesson', () => {
      const { lesson } = useLesson('vue-course', 'non-existent')

      expect(lesson.value).toBeNull()
    })

    it('should return course data', () => {
      const { course } = useLesson('vue-course', 'lesson-1')

      expect(course.value?.title).toBe('Vue.js Course')
    })
  })

  // ═══════════════════════════════════════
  // Navigation
  // ═══════════════════════════════════════
  describe('navigation', () => {
    it('should calculate current index correctly', () => {
      const { currentIndex } = useLesson('vue-course', 'lesson-2')

      expect(currentIndex.value).toBe(1)
    })

    it('should return total lessons count', () => {
      const { totalLessons } = useLesson('vue-course', 'lesson-1')

      expect(totalLessons.value).toBe(3)
    })

    it('should return previous lesson', () => {
      const { prevLesson } = useLesson('vue-course', 'lesson-2')

      expect(prevLesson.value?.slug).toBe('lesson-1')
    })

    it('should return null for prevLesson on first lesson', () => {
      const { prevLesson } = useLesson('vue-course', 'lesson-1')

      expect(prevLesson.value).toBeNull()
    })

    it('should return next lesson', () => {
      const { nextLesson } = useLesson('vue-course', 'lesson-2')

      expect(nextLesson.value?.slug).toBe('lesson-3')
    })

    it('should return null for nextLesson on last lesson', () => {
      const { nextLesson } = useLesson('vue-course', 'lesson-3')

      expect(nextLesson.value).toBeNull()
    })

    it('should navigate to previous lesson', () => {
      const { goToPrev, prevLesson } = useLesson('vue-course', 'lesson-2')

      // اطمینان از وجود درس قبلی
      expect(prevLesson.value).not.toBeNull()

      goToPrev()

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/courses/vue-course/lessons/lesson-1')
    })

    it('should navigate to next lesson', () => {
      const { goToNext, nextLesson } = useLesson('vue-course', 'lesson-2')

      // اطمینان از وجود درس بعدی
      expect(nextLesson.value).not.toBeNull()

      goToNext()

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/courses/vue-course/lessons/lesson-3')
    })

    it('should not navigate if no previous lesson', () => {
      const { goToPrev } = useLesson('vue-course', 'lesson-1')

      goToPrev()

      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should not navigate if no next lesson', () => {
      const { goToNext } = useLesson('vue-course', 'lesson-3')

      goToNext()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  // ═══════════════════════════════════════
  // Progress
  // ═══════════════════════════════════════
  describe('progress', () => {
    it('should calculate progress percentage', () => {
      const { progressPercentage } = useLesson('vue-course', 'lesson-2')

      expect(progressPercentage.value).toBeCloseTo(66.67, 0)
    })

    it('should return completion status from store', () => {
      mockProgressData[2] = { lessonId: 2, isCompleted: true, isBookmarked: false, progressPercentage: 100 }

      const { isLessonCompleted } = useLesson('vue-course', 'lesson-2')

      expect(isLessonCompleted.value).toBe(true)
    })

    it('should return bookmark status from store', () => {
      mockProgressData[2] = { lessonId: 2, isCompleted: false, isBookmarked: true, progressPercentage: 0 }

      const { isLessonBookmarked } = useLesson('vue-course', 'lesson-2')

      expect(isLessonBookmarked.value).toBe(true)
    })
  })

  // ═══════════════════════════════════════
  // Breadcrumbs
  // ═══════════════════════════════════════
  describe('breadcrumbs', () => {
    it('should generate correct breadcrumbs', () => {
      const { breadcrumbs } = useLesson('vue-course', 'lesson-2')

      expect(breadcrumbs.value).toEqual([
        { name: 'Courses', path: '/courses' },
        { name: 'Vue.js Course', path: '/courses/vue-course' },
        { name: 'Lesson 2', path: '#' },
      ])
    })
  })

  // ═══════════════════════════════════════
  // Course Progress
  // ═══════════════════════════════════════
  describe('course progress', () => {
    it('should calculate course progress from store', () => {
      mockProgressData = {
        1: { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
        2: { lessonId: 2, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
      }

      const { courseProgress } = useLesson('vue-course', 'lesson-1')

      expect(courseProgress.value.completed).toBe(2)
      expect(courseProgress.value.total).toBe(3)
      expect(courseProgress.value.percentage).toBeCloseTo(66.67, 0)
    })
  })
})
