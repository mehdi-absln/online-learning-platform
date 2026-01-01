import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import LessonPage from '~/pages/courses/[courseSlug]/lessons/[lessonSlug].vue'

// Mock the composables and dependencies
vi.mock('~/composables/useCourse', () => ({
  useCourse: () => ({
    course: {
      id: 1,
      title: 'Test Course',
      slug: 'test-course',
      courseContent: [
        {
          id: 1,
          title: 'Introduction',
          content: [
            {
              id: 1,
              title: 'Welcome',
              slug: 'welcome',
              description: 'Welcome to the course',
              duration: '5:30'
            },
            {
              id: 2,
              title: 'Overview',
              slug: 'overview',
              description: 'Course overview',
              duration: '8:15'
            }
          ]
        }
      ]
    },
    isLoading: false,
    error: null
  })
}))

vi.mock('~/composables/useLesson', () => ({
  useLesson: () => ({
    markLessonComplete: vi.fn(),
    markLessonIncomplete: vi.fn(),
    toggleBookmark: vi.fn(),
    saveNotes: vi.fn(),
    getLessonProgress: vi.fn(),
    isLessonCompleted: vi.fn().mockReturnValue(false),
    isLessonBookmarked: vi.fn().mockReturnValue(false),
    getLessonNotes: vi.fn()
  })
}))

// Mock Nuxt's composables
vi.mock('#app', async () => {
  const actual = await vi.importActual('#app')
  return {
    ...actual,
    useRoute: () => ({
      params: {
        courseSlug: 'test-course',
        lessonSlug: 'welcome'
      }
    }),
    useRouter: () => ({
      push: vi.fn()
    }),
    useSeoMeta: vi.fn()
  }
})

describe('LessonPage', () => {
  it('renders correctly when lesson is found', async () => {
    const wrapper = mount(LessonPage, {
      global: {
        mocks: {
          $route: {
            params: {
              courseSlug: 'test-course',
              lessonSlug: 'welcome'
            }
          }
        }
      }
    })
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    
    // Check that the lesson title is rendered
    expect(wrapper.text()).toContain('Welcome')
    
    // Check that the course title is rendered in the header
    expect(wrapper.text()).toContain('Test Course')
  })
  
  it('shows error state when lesson is not found', async () => {
    // Mock a scenario where lesson is not found
    const wrapper = mount(LessonPage, {
      global: {
        mocks: {
          $route: {
            params: {
              courseSlug: 'test-course',
              lessonSlug: 'non-existent-lesson'
            }
          }
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    // Check for error state
    expect(wrapper.text()).toContain('Lesson Not Found')
  })
})