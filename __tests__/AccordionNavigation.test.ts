import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import Accordion from '~/components/Accordion.vue'

// Mock the navigateTo function
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

describe('Accordion.vue', () => {
  it('navigates to lesson page when lesson button is clicked', async () => {
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

    const courseId = 123
    
    const wrapper = mount(Accordion, {
      props: {
        items,
        courseId
      }
    })

    // Manually open the accordion item to make lessons visible
    await wrapper.vm.toggleAccordion(0)

    // Find the video button by its aria-label attribute
    const videoButton = wrapper.find('button[aria-label="Watch video for Lesson 1: Getting Started"]')
    
    // Trigger the click event
    await videoButton.trigger('click')
    
    // Check that navigateTo was called with the correct path
    expect(mockNavigateTo).toHaveBeenCalledWith('/courses/123/lessons/1')
  })
})