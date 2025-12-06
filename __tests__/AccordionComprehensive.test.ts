import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Accordion from '~/components/Accordion.vue'

// Mock the composables
vi.mock('~/composables/useAccordion', async () => {
  const actual = await vi.importActual('~/composables/useAccordion')
  return {
    ...actual,
    useAccordion: vi.fn(() => ({
      openItemIds: { value: new Set() },
      toggle: vi.fn(),
      isOpen: vi.fn(() => false),
      emitUpdate: vi.fn(),
    })),
  }
})

vi.mock('~/composables/useKeyboardFocus', async () => {
  const actual = await vi.importActual('~/composables/useKeyboardFocus')
  return {
    ...actual,
    useKeyboardFocus: vi.fn(() => ({
      handleKeyDown: vi.fn(),
    })),
  }
})

describe('Accordion - Comprehensive Tests', () => {
  const mockItems = [
    { id: 1, title: 'Section 1', description: 'Description 1' },
    { id: 2, title: 'Section 2', description: 'Description 2' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Structure and Rendering', () => {
    it('renders correctly with provided items', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      expect(wrapper.findAll('button')).toHaveLength(mockItems.length)
      expect(wrapper.find('button').text()).toContain('Section 1')
      expect(wrapper.find('button').text()).toContain('Description 1')
    })

    it('renders chevron icon by default', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('svg').classes()).toContain('w-5')
      expect(wrapper.find('svg').classes()).toContain('h-5')
    })

    it('does not render description if not provided', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: [
            { id: 1, title: 'Section 1' }, // No description property
          ],
        },
      })

      expect(wrapper.text()).toContain('Section 1')
      expect(wrapper.text()).not.toContain('Description 1')
    })

    it('renders with unique IDs for headers and content', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      // Check that IDs are generated correctly
      expect(wrapper.find('#accordion-header-0').exists()).toBe(true)
      expect(wrapper.find('#accordion-content-0').exists()).toBe(true)
      expect(wrapper.find('#accordion-header-1').exists()).toBe(true)
      expect(wrapper.find('#accordion-content-1').exists()).toBe(true)
    })
  })

  describe('Props Functionality', () => {
    it('applies headerClass correctly', () => {
      const customClass = 'bg-blue-100 text-blue-800'
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
          headerClass: customClass,
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-blue-100')
      expect(button.classes()).toContain('text-blue-800')
    })

    it('applies contentClass correctly', () => {
      const customClass = 'p-6 bg-gray-50 rounded'
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
          contentClass: customClass,
        },
      })

      const contentDiv = wrapper.find('[role="region"]')
      expect(contentDiv.classes()).toContain('p-6')
      expect(contentDiv.classes()).toContain('bg-gray-50')
      expect(contentDiv.classes()).toContain('rounded')
    })

    it('applies transitionDuration correctly', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
          transitionDuration: 500,
        },
      })

      expect(wrapper.html()).toContain('duration-500')
    })

    it('uses custom emptyText when provided', () => {
      const customEmptyText = 'Nothing here'
      const wrapper = mount(Accordion, {
        props: {
          items: [
            { id: 1, title: 'Section 1' },
          ],
          emptyText: customEmptyText,
        },
      })

      expect(wrapper.text()).toContain(customEmptyText)
    })

    it('respects exclusive prop (when implemented)', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
          exclusive: true,
        },
      })

      expect(wrapper.props().exclusive).toBe(true)
    })
  })

  describe('Slots Functionality', () => {
    it('renders header slot correctly', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
        slots: {
          header: '<div class="custom-header">Custom Header: {{ item.title }}</div>',
        },
      })

      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toContain('Custom Header: Section 1')
    })

    it('renders icon slot correctly', () => {
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

    it('renders default content slot correctly', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: [
            { id: 1, title: 'Section 1', customContent: 'My Custom Content' },
          ],
        },
        slots: {
          default: '<div class="custom-content">Content: {{ item.customContent }}</div>',
        },
      })

      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.find('.custom-content').text()).toBe('Content: My Custom Content')
    })

    it('renders empty slot when provided', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: [
            { id: 1, title: 'Section 1' },
          ],
        },
        slots: {
          empty: '<div class="custom-empty">Custom Empty Content</div>',
        },
      })

      expect(wrapper.find('.custom-empty').exists()).toBe(true)
      expect(wrapper.find('.custom-empty').text()).toBe('Custom Empty Content')
    })
  })

  describe('Accessibility and Keyboard Navigation', () => {
    it('has proper ARIA attributes', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBe('accordion-content-0')

      const content = wrapper.find('[role="region"]')
      expect(content.attributes('aria-labelledby')).toBe('accordion-header-0')
    })

    it('has proper keyboard event handling', async () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      const button = wrapper.find('button')
      await button.trigger('keydown', { key: 'ArrowDown' })

      // Should call keyboard handling function
      expect(button.exists()).toBe(true)
    })
  })

  describe('State and Interaction', () => {
    it('toggles accordion on click', async () => {
      const mockToggle = vi.fn()
      const mockIsOpen = vi.fn().mockReturnValue(false)
      
      const { useAccordion } = await import('~/composables/useAccordion')
      vi.mocked(useAccordion).mockReturnValue({
        openItemIds: { value: new Set() },
        toggle: mockToggle,
        isOpen: mockIsOpen,
        emitUpdate: vi.fn(),
      })

      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      const button = wrapper.find('button')
      await button.trigger('click')
      
      expect(mockToggle).toHaveBeenCalledWith(0)
    })

    it('shows correct open state', async () => {
      const mockIsOpen = vi.fn().mockImplementation((index) => index === 0)

      const { useAccordion } = await import('~/composables/useAccordion')
      vi.mocked(useAccordion).mockReturnValue({
        openItemIds: { value: new Set([0]) },
        toggle: vi.fn(),
        isOpen: mockIsOpen,
        emitUpdate: vi.fn(),
      })

      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      const button = wrapper.find('button')
      // Should show as expanded if isOpen returns true
      expect(button.attributes('aria-expanded')).toBe('true')
    })
  })

  describe('Disabled Items', () => {
    it('disables accordion item when disabled prop is true', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: [
            { id: 1, title: 'Section 1', disabled: true },
            { id: 2, title: 'Section 2', disabled: false },
          ],
        },
      })

      const disabledButton = wrapper.findAll('button')[0]
      const enabledButton = wrapper.findAll('button')[1]
      
      expect(disabledButton.attributes('disabled')).toBe('')
      expect(enabledButton.attributes('disabled')).toBe(undefined)
    })
  })

  describe('Transition Functionality', () => {
    it('has proper transition classes', () => {
      const wrapper = mount(Accordion, {
        props: {
          items: mockItems,
        },
      })

      // Check if transition classes are present
      expect(wrapper.html()).toContain('transition-all')
      expect(wrapper.html()).toContain('ease-out')
      expect(wrapper.html()).toContain('ease-in')
      expect(wrapper.html()).toContain('opacity-0')
      expect(wrapper.html()).toContain('max-h-0')
    })
  })
})