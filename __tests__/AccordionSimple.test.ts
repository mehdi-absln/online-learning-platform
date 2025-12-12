import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Accordion from '~/components/Accordion.vue'

describe('Accordion - Basic Tests', () => {
  const mockItems = [
    { id: 0, title: 'Section 1', description: 'Description 1' },
    { id: 1, title: 'Section 2', description: 'Description 2' },
  ]

  it('renders correctly with items', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
      },
    })

    // Check that accordion items are rendered
    expect(wrapper.findAll('button')).toHaveLength(mockItems.length)
    expect(wrapper.text()).toContain('Section 1')
    expect(wrapper.text()).toContain('Section 2')
    expect(wrapper.text()).toContain('Description 1')
    expect(wrapper.text()).toContain('Description 2')
  })

  it('applies custom classes correctly', () => {
    const customHeaderClass = 'bg-blue-100 text-blue-800'
    const customContentClass = 'p-6 bg-gray-50'

    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
        headerClass: customHeaderClass,
        contentClass: customContentClass,
      },
    })

    // Check if custom header class is applied
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-blue-100')
    expect(button.classes()).toContain('text-blue-800')
  })

  it('renders empty text correctly', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1' },
        ],
      },
    })

    // Should render default empty text when no content provided
    expect(wrapper.text()).toContain('No Content')
  })

  it('renders custom empty text when provided', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1' },
        ],
        emptyText: 'No items available',
      },
    })

    // Should render custom empty text
    expect(wrapper.text()).toContain('No items available')
  })

  it('applies transition duration correctly', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
        transitionDuration: 500,
      },
    })

    // Check if the transition duration is applied in the transition classes
    expect(wrapper.html()).toContain('duration-500')
  })
})
