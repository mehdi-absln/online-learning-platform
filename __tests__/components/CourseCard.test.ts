import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CourseCard from '~/components/courses/CourseCard.vue'
import type { Course } from '~/types/course'
import { PLACEHOLDER_COURSE_IMAGE } from '~/constants'

const mockAddItem = vi.fn()
const mockIsInCart = vi.fn(() => false)
const mockOpenCart = vi.fn()

vi.mock('~/composables/useCart', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    isInCart: mockIsInCart,
    openCart: mockOpenCart,
  }),
}))

vi.mock('~/stores/user', () => ({
  useUserStore: () => ({
    isAuthenticated: false,
    canPurchaseCourses: true,
    user: null,
    isEnrolled: vi.fn(() => false),
    isCourseInstructor: vi.fn(() => false),
  }),
}))

// Mock NuxtLink component
const MockNuxtLink = {
  name: 'NuxtLink',
  template: '<a><slot /></a>',
  props: ['to'],
}

const MockNuxtImg = {
  name: 'NuxtImg',
  props: ['src', 'alt'],
  template: '<img :src="src" :alt="alt" @error="$emit(\'error\', $event)">',
}

describe('CourseCard', () => {
  const mockCourse: Course = {
    id: 1,
    title: 'Test Course',
    description: 'Test Description',
    slug: 'test-course',
    category: 'Programming',
    price: 99.99,
    thumbnail: '/non-existent-image.jpg',
    instructorId: 1,
    level: 'Beginner',
    tags: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
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
  }

  beforeEach(() => {
    // Mock console.warn to prevent console output during tests
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockAddItem.mockReset()
    mockIsInCart.mockReset()
    mockIsInCart.mockReturnValue(false)
    mockOpenCart.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses placeholder image when course image fails to load', async () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse,
      },
      global: {
        components: {
          NuxtLink: MockNuxtLink,
          NuxtImg: MockNuxtImg,
        },
      },
    })

    // Simulate image error event
    const imageElement = wrapper.find('img[alt="Test Course"]')
    await imageElement.trigger('error')
    await nextTick()

    // Check if the placeholder image is now set
    expect(imageElement.attributes('src')).toContain(PLACEHOLDER_COURSE_IMAGE)
  })

  it('renders course information correctly', () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse,
      },
      global: {
        components: {
          NuxtLink: MockNuxtLink,
          NuxtImg: MockNuxtImg,
        },
      },
    })

    // Check that the course title exists in the rendered HTML
    expect(wrapper.html()).toContain('Test Course')

    expect(wrapper.text()).toContain('Programming')
    expect(wrapper.text()).toContain('$99.99')
    expect(wrapper.text()).toContain('John Doe')
  })
})
