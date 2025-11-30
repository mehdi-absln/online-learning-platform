import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Accordion from '~/components/Accordion.vue'

describe('Accordion.vue', () => {
  it('shows video button when lesson has videoUrl', async () => {
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

    const wrapper = mount(Accordion, {
      props: {
        items
      }
    })

    // Manually open the accordion item to make lessons visible
    await wrapper.vm.toggleAccordion(0)

    // Find the video button by its aria-label attribute
    const videoButton = wrapper.find(
      'button[aria-label="Watch video for Lesson 1: Getting Started"]'
    )
    expect(videoButton.exists()).toBe(true)

    // Check if the button contains the video icon
    const videoIcon = videoButton.find('svg')
    expect(videoIcon.exists()).toBe(true)
  })

  it('does not show video button when lesson has no videoUrl', async () => {
    const items = [
      {
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            title: 'Lesson 1: Getting Started',
            duration: '15 min'
          }
        ]
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      }
    })

    // Manually open the accordion item to make lessons visible
    await wrapper.vm.toggleAccordion(0)

    // Find the video button - it should not exist
    const videoButton = wrapper.find('button[aria-label^="Watch video for"]')
    expect(videoButton.exists()).toBe(false)
  })

  it('correctly toggles accordion items by ID when available', async () => {
    const items = [
      {
        id: 'section-1',
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Lesson 1: Getting Started',
            duration: '15 min'
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Module 2: Advanced Topics',
        description: 'Advanced concepts',
        duration: '60 min',
        lessons: [
          {
            id: 'lesson-2',
            title: 'Lesson 2: Deep Dive',
            duration: '20 min'
          }
        ]
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items,
        exclusive: false
      }
    })

    // Initially no items should be open
    expect(wrapper.vm.isOpen(0)).toBe(false)
    expect(wrapper.vm.isOpen(1)).toBe(false)

    // Open first item
    await wrapper.vm.toggleAccordion(0)

    // First item should be open, second should remain closed
    expect(wrapper.vm.isOpen(0)).toBe(true)
    expect(wrapper.vm.isOpen(1)).toBe(false)

    // Open second item (both should be open since exclusive is false)
    await wrapper.vm.toggleAccordion(1)

    // Both items should be open
    expect(wrapper.vm.isOpen(0)).toBe(true)
    expect(wrapper.vm.isOpen(1)).toBe(true)

    // Close first item
    await wrapper.vm.toggleAccordion(0)

    // First should be closed, second should remain open
    expect(wrapper.vm.isOpen(0)).toBe(false)
    expect(wrapper.vm.isOpen(1)).toBe(true)
  })

  it('correctly manages exclusive accordion behavior', async () => {
    const items = [
      {
        id: 'section-1',
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        duration: '45 min',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Lesson 1: Getting Started',
            duration: '15 min'
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Module 2: Advanced Topics',
        description: 'Advanced concepts',
        duration: '60 min',
        lessons: [
          {
            id: 'lesson-2',
            title: 'Lesson 2: Deep Dive',
            duration: '20 min'
          }
        ]
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items,
        exclusive: true
      }
    })

    // Open first item
    await wrapper.vm.toggleAccordion(0)
    expect(wrapper.vm.isOpen(0)).toBe(true)
    expect(wrapper.vm.isOpen(1)).toBe(false)

    // Open second item - should close first and open second (exclusive behavior)
    await wrapper.vm.toggleAccordion(1)
    expect(wrapper.vm.isOpen(0)).toBe(false)
    expect(wrapper.vm.isOpen(1)).toBe(true)
  })
})
