import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Accordion from '~/components/ui/Accordion.vue'

describe('Accordion.vue', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    vi.clearAllMocks()
  })

  it('renders lesson content through the default slot when an item is open', async () => {
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
            slug: 'lesson-1-getting-started',
          },
        ],
      },
    ]

    const wrapper = mount(Accordion, {
      props: {
        items,
        modelValue: [0],
      },
      slots: {
        default: '<button class="lesson-item">{{ item.lessons[0].title }}</button>',
      },
    })

    expect(wrapper.find('.lesson-item').exists()).toBe(true)
    expect(wrapper.find('.lesson-item').text()).toContain('Lesson 1: Getting Started')
  })

  it('does not open disabled accordion items', async () => {
    const items = [
      {
        title: 'Module 1: Introduction',
        description: 'Basic concepts',
        disabled: true,
      },
    ]

    const wrapper = mount(Accordion, {
      props: {
        items,
      },
    })

    const accordionHeader = wrapper.find('button[aria-controls^="accordion-content-"]')
    await accordionHeader.trigger('click')

    expect(accordionHeader.attributes('disabled')).toBeDefined()
    expect(accordionHeader.attributes('aria-expanded')).toBe('false')
  })
})
