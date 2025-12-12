import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CourseCard from '~/components/courses/CourseCard.vue'
import type { Course } from '~/types/shared/courses'

// Mock NuxtLink component
const MockNuxtLink = {
  name: 'NuxtLink',
  template: '<a><slot /></a>',
  props: ['to'],
}

describe('CourseCard', () => {
  const mockCourse: Course = {
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
  }

  beforeEach(() => {
    // Mock console.warn to prevent console output during tests
    vi.spyOn(console, 'warn').mockImplementation(() => {})
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
        },
      },
    })

    // Simulate image error event
    const imageElement = wrapper.find('img[alt="Test Course"]')
    await imageElement.trigger('error')

    // Check if the placeholder image is now set
    expect(imageElement.attributes('src')).toBe('/images/placeholder-course.svg')
  })

  it('renders course information correctly', () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse,
      },
      global: {
        components: {
          NuxtLink: MockNuxtLink,
        },
      },
    })

    // Check that the course title exists in the rendered HTML
    expect(wrapper.html()).toContain('Test Course')

    expect(wrapper.text()).toContain('Programming')
    expect(wrapper.text()).toContain('$99.99')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('emits bookmark event when bookmark button is clicked', async () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse,
      },
      global: {
        components: {
          NuxtLink: MockNuxtLink,
        },
      },
    })

    const bookmarkButton = wrapper.find('button')
    await bookmarkButton.trigger('click')

    expect(wrapper.emitted('bookmark')).toBeTruthy()
    expect(wrapper.emitted('bookmark')![0]).toEqual([1])
  })
})
