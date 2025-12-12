import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SidebarFilters from '~/components/SidebarFilters.vue'
import { useCourseFilters } from '~/composables/useCourseFilters'

// Mock the composable
vi.mock('~/composables/useCourseFilters', () => ({
  useCourseFilters: vi.fn(),
}))

describe('SidebarFilters', () => {
  const mockCourseFilters = {
    filter: {
      categories: [],
      levels: [],
      tags: [],
      freeOnly: false,
      paidOnly: false,
      searchQuery: '',
      instructorId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    },
    categories: ['Development', 'Design'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['JavaScript', 'Vue', 'Nuxt'],
    applyFilters: vi.fn(),
    resetFilters: vi.fn(),
    toggleExclusiveFilter: vi.fn(),
    fetchFilterOptions: vi.fn(),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    vi.mocked(useCourseFilters).mockReturnValue(mockCourseFilters)
  })

  it('renders correctly with filter options', () => {
    const wrapper = mount(SidebarFilters, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(wrapper.find('input[placeholder="Search courses..."]').exists()).toBe(true)
    expect(wrapper.findAll('.space-y-2').length).toBeGreaterThan(0)
  })

  it('displays filter options', () => {
    const wrapper = mount(SidebarFilters, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    // Check that filter options are displayed
    expect(wrapper.text()).toContain('Development')
    expect(wrapper.text()).toContain('Design')
    expect(wrapper.text()).toContain('Beginner')
    expect(wrapper.text()).toContain('Intermediate')
    expect(wrapper.text()).toContain('Advanced')
    expect(wrapper.text()).toContain('JavaScript')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).toContain('Nuxt')
  })
})
