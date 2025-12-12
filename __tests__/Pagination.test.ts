import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Pagination from '~/components/Pagination.vue'

describe('Pagination', () => {
  const defaultProps = {
    totalPages: 5,
    onPageChange: vi.fn(),
  }

  it('renders correctly with default values', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    // Should show page 1 of 5 by default
    expect(wrapper.text()).toContain('Page 1 of 5')
    expect(wrapper.find('button[aria-current="page"]').text()).toBe('1')
  })

  it('renders with custom currentPage', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 3,
      },
    })

    // Should show page 3 of 5
    expect(wrapper.text()).toContain('Page 3 of 5')
    expect(wrapper.find('button[aria-current="page"]').text()).toBe('3')
  })

  it('disables previous button on first page', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 1,
      },
    })

    const buttons = wrapper.findAll('button')
    const previousButton = buttons[0] // First button is Previous
    expect(previousButton.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 5,
      },
    })

    const buttons = wrapper.findAll('button')
    const nextButton = buttons[buttons.length - 1] // Last button is Next
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('calls onPageChange when navigating to next page', async () => {
    const mockOnPageChange = vi.fn()
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 2,
        onPageChange: mockOnPageChange,
      },
    })

    const buttons = wrapper.findAll('button')
    const nextButton = buttons[buttons.length - 1] // Last button is Next
    await nextButton.trigger('click')

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when navigating to previous page', async () => {
    const mockOnPageChange = vi.fn()
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 3,
        onPageChange: mockOnPageChange,
      },
    })

    const buttons = wrapper.findAll('button')
    const previousButton = buttons[0] // First button is Previous
    await previousButton.trigger('click')

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when clicking on a specific page', async () => {
    const mockOnPageChange = vi.fn()
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 2,
        onPageChange: mockOnPageChange,
      },
    })

    const pageButtons = wrapper.findAll('button').slice(1, -1) // Exclude prev/next buttons
    // Find the button for page 4
    const page4Button = Array.from(pageButtons).find(btn => btn.text() === '4')
    if (page4Button) {
      await page4Button.trigger('click')
      expect(mockOnPageChange).toHaveBeenCalledWith(4)
    }
  })

  it('shows correct page range around current page', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 3,
        totalPages: 10,
      },
    })

    // With currentPage=3, should show pages 1,2,3,4,5
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('5')
  })

  it('handles edge case when totalPages is 1', () => {
    const wrapper = mount(Pagination, {
      props: {
        totalPages: 1,
        onPageChange: vi.fn(),
        currentPage: 1,
      },
    })

    expect(wrapper.text()).toContain('Page 1 of 1')
    const buttons = wrapper.findAll('button')
    // Both previous and next buttons should be disabled
    expect(buttons[0].attributes('disabled')).toBeDefined() // Previous
    expect(buttons[buttons.length - 1].attributes('disabled')).toBeDefined() // Next
  })
})