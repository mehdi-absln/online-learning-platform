import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CourseDetailPage from '~/pages/courses/[courseSlug]/index.vue'

// Mock NuxtLink component
const MockNuxtLink = {
  name: 'NuxtLink',
  template: '<a><slot /></a>',
  props: ['to'],
}

// Mock the useCoursesStore
vi.mock('~/stores/courses', () => ({
  useCoursesStore: vi.fn(() => ({
    detailedCourse: {
      id: 1,
      title: 'Test Course',
      description: 'Test Description',
      slug: 'test-course',
      category: 'Programming',
      price: 99.99,
      image: '/non-existent-image.jpg', // Image that doesn't exist to trigger error handler
      instructor: {
        id: 1,
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
          content: [
            { id: 1, title: 'Welcome', duration: '10:30', slug: 'welcome' },
          ],
        },
      ],
      reviews: [
        {
          id: 1,
          reviewerName: 'Jane Smith',
          rating: 5,
          comment: 'Great course!',
          date: '2023-01-15',
        },
      ],
      tags: 'javascript, programming',
    },
    error: null,
  })),
}))

// Mock useCourse composable
vi.mock('~/composables/useCourse', () => ({
  useCourse: vi.fn(() => ({
    course: {
      id: 1,
      title: 'Test Course',
      description: 'Test Description',
      slug: 'test-course',
      category: 'Programming',
      price: 99.99,
      image: '/non-existent-image.jpg', // Image that doesn't exist to trigger error handler
      instructor: {
        id: 1,
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
          content: [
            { id: 1, title: 'Welcome', duration: '10:30', slug: 'welcome' },
          ],
        },
      ],
      reviews: [
        {
          id: 1,
          reviewerName: 'Jane Smith',
          rating: 5,
          comment: 'Great course!',
          date: '2023-01-15',
        },
      ],
      tags: 'javascript, programming',
    },
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  })),
}))

// Mock useRoute
vi.mock('#app', () => ({
  useRoute: () => ({
    params: {
      courseSlug: 'test-course',
    },
  }),
}))

// Mock createError
vi.mock('~/composables/useCourses', () => ({
  createError: vi.fn(),
}))

describe('CourseDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses placeholder image when course image fails to load', async () => {
    // For async components in Nuxt, we need to handle the suspense properly
    const wrapper = await mount(CourseDetailPage, {
      global: {
        components: {
          NuxtLink: MockNuxtLink,
        },
      },
    })

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Find the image element by class
    const imageElement = wrapper.find('img')

    // Check that the image exists
    expect(imageElement.exists()).toBe(true)

    // Simulate image error event
    await imageElement.trigger('error')

    // Check if the placeholder image is now set
    expect(imageElement.attributes('src')).toBe('/images/placeholder-course.svg')
  })
})
