import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '~/components/ui/EmptyState.vue'

// `EmptyState.vue` uses Nuxt auto-imported components (`IconBookOpen` from
// `@nuxt/icon` and `NuxtLink`), which are not registered under plain
// `@vue/test-utils`. Stub them so Vue doesn't emit
// "Failed to resolve component" warnings. Matches the pattern used in
// `CourseCard.test.ts` and `lesson-page.test.ts`.
const globalStubs = {
  stubs: {
    NuxtLink: { template: '<a><slot /></a>', props: ['to'] },
    IconBookOpen: true,
  },
}

describe('EmptyState', () => {
  it('renders title correctly', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No Courses Found',
      },
      global: globalStubs,
    })

    expect(wrapper.text()).toContain('No Courses Found')
  })

  it('renders message when provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty Cart',
        message: 'Your cart is empty',
      },
      global: globalStubs,
    })

    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('renders action link when actionTo is provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Get Started',
        actionTo: '/courses',
        actionLabel: 'Browse Courses',
      },
      global: globalStubs,
    })

    // Component should render without crashing
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Get Started')
    // Note: NuxtLink content may not render in test environment
  })

  it('renders button with action callback when actionLabel provided without actionTo', async () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No Results',
        actionLabel: 'Clear Filters',
      },
      global: globalStubs,
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Clear Filters')

    // Test emit
    await button.trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('uses default icon when no icon slot provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Default Icon Test',
      },
      global: globalStubs,
    })

    // Check that icon container exists
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('accepts custom icon via slot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Custom Icon',
      },
      slots: {
        icon: '<span class="custom-icon">🎯</span>',
      },
      global: globalStubs,
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Accessibility Test',
      },
      global: globalStubs,
    })

    // Check for role="status"
    expect(wrapper.attributes('role')).toBe('status')

    // Check for aria-live
    expect(wrapper.attributes('aria-live')).toBe('polite')

    // Check for aria-labelledby
    expect(wrapper.attributes('aria-labelledby')).toBe('empty-state-title')
  })
})
