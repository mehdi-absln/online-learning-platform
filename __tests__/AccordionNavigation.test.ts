import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import Accordion from '~/components/Accordion.vue'

// Import navigateTo to be able to mock it
import { navigateTo } from '#app'

describe('Accordion.vue', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    vi.clearAllMocks()
  })

  it('navigates to lesson page when lesson button is clicked', async () => {
    const mockNavigateTo = vi.fn()
    vi.mocked(navigateTo).mockImplementation(mockNavigateTo)

    const items = [
      {
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            id: 1,
            title: 'Lesson 1: Getting Started',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      }
    ]

    const courseId = 123

    const wrapper = mount(Accordion, {
      props: {
        items,
        courseId
      }
    })

    // Wait for component to be fully mounted
    await nextTick()

    // Manually open the accordion item to make lessons visible
    await wrapper.vm.toggleAccordion(0)
    await nextTick() // Wait for DOM update after state change

    // Find the video button by its aria-label attribute
    const videoButton = wrapper.find(
      'button[aria-label="Watch video for Lesson 1: Getting Started"]'
    )

    // Verify the button exists
    expect(videoButton.exists()).toBe(true)

    // Trigger the click event
    await videoButton.trigger('click')

    // Check that navigateTo was called with the correct path
    expect(vi.mocked(navigateTo)).toHaveBeenCalledWith('/courses/123/lessons/1')
  })

  it('navigates to lesson page using slug when courseSlug is provided', async () => {
    const mockNavigateTo = vi.fn()
    vi.mocked(navigateTo).mockImplementation(mockNavigateTo)

    const items = [
      {
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            title: 'Lesson 1: Getting Started',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      }
    ]

    const courseSlug = 'introduction-to-vue'

    const wrapper = mount(Accordion, {
      props: {
        items,
        courseSlug
      }
    })

    // Wait for component to be fully mounted
    await nextTick()

    // Manually open the accordion item to make lessons visible
    await wrapper.vm.toggleAccordion(0)
    await nextTick() // Wait for DOM update after state change

    // Find the video button by its aria-label attribute
    const videoButton = wrapper.find(
      'button[aria-label="Watch video for Lesson 1: Getting Started"]'
    )

    // Verify the button exists
    expect(videoButton.exists()).toBe(true)

    // Trigger the click event
    await videoButton.trigger('click')

    // Check that navigateTo was called with the correct slug-based path
    expect(vi.mocked(navigateTo)).toHaveBeenCalledWith(
      '/courses/introduction-to-vue/lessons/lesson-1-getting-started'
    )
  })
})
