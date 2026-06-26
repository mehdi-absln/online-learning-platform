import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const mockNavigateTo = vi.fn()
const mockFetchLessonAccess = vi.fn()
const mockFetchProgress = vi.fn().mockResolvedValue(undefined)
const mockGoToPrev = vi.fn()
const mockGoToNext = vi.fn()
const mockToggleComplete = vi.fn()
const mockToggleBookmark = vi.fn()
const mockShareLesson = vi.fn()
const mockRefreshCourse = vi.fn()

const route = {
  params: {
    courseSlug: 'test-course',
    lessonSlug: 'welcome',
  },
}

const courseRef = ref({
  id: 1,
  title: 'Test Course',
  slug: 'test-course',
  instructor: {
    id: 1,
    userId: 1,
    name: 'John Doe',
    avatar: '/avatar.jpg',
  },
})

const lessonDataRef = ref<null | {
  id: number
  title: string
  slug: string
  description: string
  duration: string
  isFree: boolean
  isLocked: boolean
  videoUrl: string
  content: string
  createdAt: string
  updatedAt: string
}>(null)

const accessLoadingRef = ref(false)
const accessErrorRef = ref<string | null>(null)
const courseLoadingRef = ref(false)
const courseErrorRef = ref<string | null>(null)

const pageStubs = {
  ClientOnly: { template: '<div><slot /></div>' },
  Breadcrumb: { props: ['crumbs'], template: '<nav>{{ crumbs.map(crumb => crumb.name).join(" / ") }}</nav>' },
  LessonVideo: { props: ['videoUrl', 'title'], template: '<div>{{ title }}</div>' },
  LessonContent: { props: ['lesson'], template: '<div>{{ lesson?.content }}</div>' },
  LessonSidebar: { template: '<aside>Sidebar</aside>' },
  LessonNav: { template: '<div>Lesson navigation</div>' },
  LoadingSpinner: { props: ['message'], template: '<div>{{ message }}</div>' },
  ErrorState: { props: ['message'], template: '<div>{{ message }}</div>' },
  NuxtLink: { template: '<a><slot /></a>' },
  IconClock: true,
  IconCalendar: true,
  IconBookmark: true,
  IconShare: true,
  IconCheckCircle: true,
  IconLock: true,
  IconChevronRight: true,
}

describe('LessonPage', () => {
  beforeEach(() => {
    vi.resetModules()
    route.params.courseSlug = 'test-course'
    route.params.lessonSlug = 'welcome'
    courseRef.value = {
      id: 1,
      title: 'Test Course',
      slug: 'test-course',
      instructor: {
        id: 1,
        userId: 1,
        name: 'John Doe',
        avatar: '/avatar.jpg',
      },
    }
    lessonDataRef.value = {
      id: 1,
      title: 'Welcome',
      slug: 'welcome',
      description: 'Welcome to the course',
      duration: '5:30',
      isFree: true,
      isLocked: false,
      videoUrl: 'https://example.com/video.mp4',
      content: 'Lesson content',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    accessLoadingRef.value = false
    accessErrorRef.value = null
    courseLoadingRef.value = false
    courseErrorRef.value = null
    mockNavigateTo.mockReset()
    mockFetchLessonAccess.mockReset()
    mockFetchProgress.mockClear()
    mockGoToPrev.mockReset()
    mockGoToNext.mockReset()
    mockToggleComplete.mockReset()
    mockToggleBookmark.mockReset()
    mockShareLesson.mockReset()
    mockRefreshCourse.mockReset()

    vi.doMock('#imports', async () => {
      const actual = await vi.importActual<Record<string, unknown>>('#imports')
      return {
        ...actual,
        definePageMeta: vi.fn(),
        useRoute: () => route,
        navigateTo: mockNavigateTo,
        useSeoMeta: vi.fn(),
        useUserStore: () => ({
          isAuthenticated: false,
        }),
        useLessonProgressStore: () => ({
          fetchProgress: mockFetchProgress,
        }),
        useLessonAccess: () => ({
          lessonData: lessonDataRef,
          isLoading: accessLoadingRef,
          error: accessErrorRef,
          fetchLessonAccess: mockFetchLessonAccess,
        }),
        useLesson: () => ({
          course: courseRef,
          lesson: ref(null),
          courseId: ref(1),
          isLoading: courseLoadingRef,
          error: courseErrorRef,
          currentIndex: ref(0),
          totalLessons: ref(2),
          prevLesson: ref(null),
          nextLesson: ref({ id: 2, title: 'Overview', slug: 'overview', duration: '8:15', isFree: true }),
          isNextLessonAccessible: ref(true),
          progressPercentage: ref(50),
          breadcrumbs: ref([
            { name: 'Courses', path: '/courses' },
            { name: 'Test Course', path: '/courses/test-course' },
            { name: 'Welcome', path: '#' },
          ]),
          goToPrev: mockGoToPrev,
          goToNext: mockGoToNext,
          isLessonCompleted: ref(false),
          isLessonBookmarked: ref(false),
          toggleComplete: mockToggleComplete,
          toggleBookmark: mockToggleBookmark,
          shareLesson: mockShareLesson,
          refreshCourse: mockRefreshCourse,
        }),
      }
    })

    vi.doMock('vue-router', () => ({
      useRoute: () => route,
      useRouter: () => ({
        push: vi.fn(),
      }),
    }))

    vi.doMock('#app/composables/router', () => ({
      useRoute: () => route,
      useRouter: () => ({
        push: vi.fn(),
      }),
      navigateTo: mockNavigateTo,
    }))

    vi.doMock('~/composables/useLessonAccess', () => ({
      useLessonAccess: () => ({
        lessonData: lessonDataRef,
        isLoading: accessLoadingRef,
        error: accessErrorRef,
        fetchLessonAccess: mockFetchLessonAccess,
      }),
    }))

    vi.doMock('~/composables/useLesson', () => ({
      useLesson: () => ({
        course: courseRef,
        lesson: ref(null),
        courseId: ref(1),
        isLoading: courseLoadingRef,
        error: courseErrorRef,
        currentIndex: ref(0),
        totalLessons: ref(2),
        prevLesson: ref(null),
        nextLesson: ref({ id: 2, title: 'Overview', slug: 'overview', duration: '8:15', isFree: true }),
        isNextLessonAccessible: ref(true),
        progressPercentage: ref(50),
        breadcrumbs: ref([
          { name: 'Courses', path: '/courses' },
          { name: 'Test Course', path: '/courses/test-course' },
          { name: 'Welcome', path: '#' },
        ]),
        goToPrev: mockGoToPrev,
        goToNext: mockGoToNext,
        isLessonCompleted: ref(false),
        isLessonBookmarked: ref(false),
        toggleComplete: mockToggleComplete,
        toggleBookmark: mockToggleBookmark,
        shareLesson: mockShareLesson,
        refreshCourse: mockRefreshCourse,
      }),
    }))

    vi.doMock('~/stores/lesson-progress', () => ({
      useLessonProgressStore: () => ({
        fetchProgress: mockFetchProgress,
      }),
    }))

    vi.doMock('~/stores/user', () => ({
      useUserStore: () => ({
        isAuthenticated: false,
      }),
    }))
  })

  const mountPage = async () => {
    const { default: LessonPage } = await import('~/pages/courses/[courseSlug]/lessons/[lessonSlug].vue')
    return mount(LessonPage, {
      global: {
        stubs: pageStubs,
      },
    })
  }

  it('renders correctly when lesson is found', async () => {
    const wrapper = await mountPage()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Welcome')
    expect(wrapper.text()).toContain('Test Course')
  })

  it('shows error state when lesson is not found', async () => {
    lessonDataRef.value = null
    accessErrorRef.value = 'Lesson could not be loaded.'

    const wrapper = await mountPage()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Lesson could not be loaded.')
  })
})
