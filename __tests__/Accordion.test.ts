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
    const videoButton = wrapper.find('button[aria-label="Watch video for Lesson 1: Getting Started"]')
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
})