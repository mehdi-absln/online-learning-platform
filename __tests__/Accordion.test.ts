import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Accordion from '~/components/Accordion.vue'

// Mock the composables
vi.mock('~/composables/useAccordion', () => ({
  useAccordion: vi.fn(() => ({
    openItemIds: { value: new Set() },
    toggle: vi.fn(),
    isOpen: vi.fn(() => false),
    emitUpdate: vi.fn(),
  })),
}))

vi.mock('~/composables/useKeyboardFocus', () => ({
  useKeyboardFocus: vi.fn(() => ({
    handleKeyDown: vi.fn(),
  })),
}))

describe('Accordion', () => {
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

    expect(wrapper.findAll('.accordion > div')).toHaveLength(mockItems.length)
    expect(wrapper.find('button').text()).toContain('Section 1')
    expect(wrapper.find('button').text()).toContain('Description 1')
  })

  it('renders header slot correctly', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
      },
      slots: {
        header: '<div class="custom-header">Custom Header</div>',
      },
    })

    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-header').text()).toBe('Custom Header')
  })

  it('renders icon slot correctly', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
      },
      slots: {
        icon: '<div class="custom-icon">Custom Icon</div>',
      },
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('Custom Icon')
  })

  it('renders default slot correctly', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1', content: 'Content for section 1' },
        ],
      },
      slots: {
        default: '<div class="custom-content">Content: {{ item.content }}</div>',
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('renders empty slot when no content provided', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1' },
        ],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No Content')
  })

  it('renders custom empty text when provided', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1' },
        ],
        emptyText: 'No items available',
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No items available')
  })

  it('applies headerClass correctly', async () => {
    const customHeaderClass = 'bg-blue-100 text-blue-800'
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
        headerClass: customHeaderClass,
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-blue-100')
    expect(button.classes()).toContain('text-blue-800')
  })

  it('applies contentClass correctly', async () => {
    const customContentClass = 'p-6 bg-gray-50 rounded-b-lg'
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1', content: 'Test content' },
        ],
        contentClass: customContentClass,
      },
      slots: {
        default: '<div>Test content</div>',
      },
    })

    await wrapper.vm.$nextTick()
    const contentDiv = wrapper.find('[role="region"]')
    expect(contentDiv.classes()).toContain('p-6')
    expect(contentDiv.classes()).toContain('bg-gray-50')
    expect(contentDiv.classes()).toContain('rounded-b-lg')
  })

  it('applies transition duration correctly', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
        transitionDuration: 500,
      },
    })

    expect(wrapper.html()).toContain('duration-500')
  })

  it('renders chevron icon correctly when no icon slot provided', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: mockItems,
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').classes()).toContain('w-5')
    expect(wrapper.find('svg').classes()).toContain('h-5')
  })

  it('does not render description if not provided', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items: [
          { id: 0, title: 'Section 1' }, // No description property
        ],
      },
    })

    // Should only contain title, not description
    expect(wrapper.text()).toContain('Section 1')
    expect(wrapper.find('[v-if="item.description"]').exists()).toBe(false)
  })
})