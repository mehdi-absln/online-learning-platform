import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import Accordion from '~/components/Accordion.vue'

describe('Accordion.vue', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    vi.clearAllMocks()
  })

  it('emits lesson-navigate event when lesson is clicked', async () => {
    const lessonNavigateHandler = vi.fn()
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
            slug: 'lesson-1-getting-started'
          }
        ]
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      },
      emits: ['lesson-navigate']
    })

    // Set up event listener
    wrapper.vm.$emit = vi.fn((event, ...args) => {
      if (event === 'lesson-navigate') {
        lessonNavigateHandler(...args)
      }
    })

    // Click to open accordion
    const accordionHeader = wrapper.find('button[aria-controls^="accordion-content-"]')
    await accordionHeader.trigger('click')

    // Find and click the lesson item
    const lessonElement = wrapper.find('.group.flex.items-center.p-3.rounded-md')
    await lessonElement.trigger('click')

    // Check that the lesson-navigate event was emitted
    expect(lessonNavigateHandler).toHaveBeenCalledWith({
      id: 1,
      title: 'Lesson 1: Getting Started',
      duration: '15 min',
      slug: 'lesson-1-getting-started'
    })
  })

  it('does not emit event when lesson is disabled (no slug)', async () => {
    const lessonNavigateHandler = vi.fn()
    const items = [
      {
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            id: 1,
            title: 'Lesson 1: Getting Started',
            duration: '15 min'
            // No slug - lesson should be disabled
          }
        ]
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      },
      emits: ['lesson-navigate']
    })

    // Set up event listener
    wrapper.vm.$emit = vi.fn((event, ...args) => {
      if (event === 'lesson-navigate') {
        lessonNavigateHandler(...args)
      }
    })

    // Click to open accordion
    const accordionHeader = wrapper.find('button[aria-controls^="accordion-content-"]')
    await accordionHeader.trigger('click')

    // Find and click the lesson item (should be disabled)
    const lessonElement = wrapper.find('.group.flex.items-center.p-3.rounded-md')
    await lessonElement.trigger('click')

    // Check that the lesson-navigate event was not emitted
    expect(lessonNavigateHandler).not.toHaveBeenCalled()
  })
})
