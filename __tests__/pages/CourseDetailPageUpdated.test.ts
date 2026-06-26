import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { PLACEHOLDER_COURSE_IMAGE } from '~/constants'

const route = {
  params: {
    courseSlug: 'test-course',
  },
  fullPath: '/courses/test-course',
}

const courseRef = ref({
  id: 1,
  title: 'Test Course',
  description: 'Test Description',
  slug: 'test-course',
  category: 'Programming',
  price: 99.99,
  thumbnail: '/non-existent-image.jpg',
  instructorId: 1,
  instructor: {
    id: 1,
    userId: 1,
    name: 'John Doe',
    avatar: '/instructor-avatar.jpg',
  },
  rating: 4.5,
  stats: {
    students: 100,
  },
  level: 'Beginner',
  learningObjectives: ['Learn basics', 'Practice skills'],
  courseContent: [
    {
      id: 1,
      title: 'Introduction',
      description: 'Basic concepts',
      lessons: 1,
      content: [
        { id: 1, title: 'Welcome', duration: '10:30', slug: 'welcome' },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      rating: 5,
      comment: 'Great course!',
      createdAt: '2023-01-15',
      user: {
        id: 2,
        name: 'Jane Smith',
        avatar: '/jane-avatar.jpg',
      },
    },
  ],
  tags: 'javascript, programming',
  createdAt: new Date(),
  updatedAt: new Date(),
})

const isLoadingRef = ref(false)
const errorRef = ref(false)
const mockAddItem = vi.fn()
const mockIsInCart = vi.fn(() => false)
const mockOpenCart = vi.fn()

const MockNuxtLink = {
  name: 'NuxtLink',
  template: '<a><slot /></a>',
  props: ['to'],
}

vi.mock('~/composables/useCart', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    isInCart: mockIsInCart,
    openCart: mockOpenCart,
  }),
}))

describe('CourseDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    route.params.courseSlug = 'test-course'
    route.fullPath = '/courses/test-course'
    courseRef.value = {
      id: 1,
      title: 'Test Course',
      description: 'Test Description',
      slug: 'test-course',
      category: 'Programming',
      price: 99.99,
      thumbnail: '/non-existent-image.jpg',
      instructorId: 1,
      instructor: {
        id: 1,
        userId: 1,
        name: 'John Doe',
        avatar: '/instructor-avatar.jpg',
      },
      rating: 4.5,
      stats: {
        students: 100,
      },
      level: 'Beginner',
      learningObjectives: ['Learn basics', 'Practice skills'],
      courseContent: [
        {
          id: 1,
          title: 'Introduction',
          description: 'Basic concepts',
          lessons: 1,
          content: [
            { id: 1, title: 'Welcome', duration: '10:30', slug: 'welcome' },
          ],
        },
      ],
      reviews: [
        {
          id: 1,
          rating: 5,
          comment: 'Great course!',
          createdAt: '2023-01-15',
          user: {
            id: 2,
            name: 'Jane Smith',
            avatar: '/jane-avatar.jpg',
          },
        },
      ],
      tags: 'javascript, programming',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    isLoadingRef.value = false
    errorRef.value = false
    mockAddItem.mockReset()
    mockIsInCart.mockReset()
    mockIsInCart.mockReturnValue(false)
    mockOpenCart.mockReset()

    vi.doMock('#imports', async () => {
      const actual = await vi.importActual<Record<string, unknown>>('#imports')
      return {
        ...actual,
        useRoute: () => route,
        createError: vi.fn((input: { message?: string, statusMessage?: string }) => new Error(input.statusMessage || input.message || 'error')),
        useSeoMeta: vi.fn(),
        useCourse: () => ({
          course: courseRef,
          isLoading: isLoadingRef,
          error: errorRef,
          refresh: vi.fn(),
        }),
        useUserStore: () => ({
          isAuthenticated: false,
          canPurchaseCourses: true,
          user: null,
          isEnrolled: vi.fn(() => false),
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
    }))

    vi.doMock('~/composables/useCourse', () => ({
      useCourse: () => ({
        course: courseRef,
        isLoading: isLoadingRef,
        error: errorRef,
        refresh: vi.fn(),
      }),
    }))

    vi.doMock('~/stores/user', () => ({
      useUserStore: () => ({
        isAuthenticated: false,
        canPurchaseCourses: true,
        user: null,
        isEnrolled: vi.fn(() => false),
      }),
    }))
  })

  const mountPage = async () => {
    const { default: CourseDetailPage } = await import('~/pages/courses/[courseSlug]/index.vue')
    return mount(CourseDetailPage, {
      global: {
        components: {
          NuxtLink: MockNuxtLink,
          NuxtImg: {
            name: 'NuxtImg',
            props: ['src', 'alt'],
            template: '<img :src="src" :alt="alt" @error="$emit(\'error\', $event)">',
          },
        },
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          RouterLink: { template: '<a><slot /></a>' },
          Breadcrumb: { props: ['crumbs'], template: '<nav>{{ crumbs.map(crumb => crumb.name).join(" / ") }}</nav>' },
          Tabs: { template: '<div><slot name="course-info" /><slot name="reviews" /></div>' },
          CourseInfoTab: { props: ['course'], template: '<div>{{ course.title }}</div>' },
          CourseReviews: { props: ['reviews'], template: '<div>{{ reviews?.length }}</div>' },
          RelatedCourses: { template: '<aside>Related courses</aside>' },
          LoadingSpinner: { props: ['message'], template: '<div>{{ message }}</div>' },
          ErrorState: { props: ['message'], template: '<div>{{ message }}</div>' },
        },
      },
    })
  }

  it('uses placeholder image when course image fails to load', async () => {
    const wrapper = await mountPage()

    await nextTick()

    const imageElement = wrapper.find('img[alt="Test Course"]')

    expect(imageElement.exists()).toBe(true)

    await imageElement.trigger('error')
    await nextTick()

    expect(imageElement.attributes('src')).toContain(PLACEHOLDER_COURSE_IMAGE)
  })
})
