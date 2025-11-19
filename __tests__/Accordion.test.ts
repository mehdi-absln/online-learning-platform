import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from '~/components/Accordion.vue'

describe('Accordion Component', () => {
  it('renders correctly with items', () => {
    const items = [
      {
        title: 'Section 1',
        lessons: ['Lesson 1', 'Lesson 2'],
        duration: '2 hours'
      },
      {
        title: 'Section 2',
        lessons: ['Lesson 3', 'Lesson 4'],
        duration: '3 hours'
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      }
    })

    // Check that the accordion items are rendered
    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.text()).toContain('Section 1')
    expect(wrapper.text()).toContain('Section 2')
  })

  it('toggles content when clicked', async () => {
    const items = [
      {
        title: 'Section 1',
        lessons: ['Lesson 1', 'Lesson 2'],
        duration: '2 hours'
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      }
    })

    const button = wrapper.find('button')
    const content = wrapper.find('[id^="accordion-content"]')

    // Initially content should exist but might be hidden by CSS
    expect(content.exists()).toBe(true)

    // Since we start with all items closed, check that they're properly set to closed
    const initialDisplayStyle = content.element.style.display
    expect(initialDisplayStyle).toBe('none')

    // Click the button to show content
    await button.trigger('click')

    // After click, content should be visible
    expect(content.isVisible()).toBe(true)
  })

  it('shows correct lessons for each section', () => {
    const items = [
      {
        title: 'Section 1',
        lessons: ['Lesson 1', 'Lesson 2'],
        duration: '2 hours'
      },
      {
        title: 'Section 2',
        lessons: ['Lesson 3', 'Lesson 4'],
        duration: '3 hours'
      }
    ]

    const wrapper = mount(Accordion, {
      props: {
        items
      }
    })

    // Check that lessons are correctly associated with sections
    expect(wrapper.text()).toContain('Lesson 1')
    expect(wrapper.text()).toContain('Lesson 2')
    expect(wrapper.text()).toContain('Lesson 3')
    expect(wrapper.text()).toContain('Lesson 4')
  })
})