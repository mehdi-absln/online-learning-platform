import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorState from '~/components/ui/ErrorState.vue'

describe('ErrorState', () => {
  it('renders default error message', () => {
    const wrapper = mount(ErrorState)

    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('renders custom message when provided', () => {
    const wrapper = mount(ErrorState, {
      props: {
        message: 'Failed to load dashboard',
      },
    })

    expect(wrapper.text()).toContain('Failed to load dashboard')
  })

  it('shows retry button by default', () => {
    const wrapper = mount(ErrorState)

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Retry')
  })

  it('shows custom retry label when provided', () => {
    const wrapper = mount(ErrorState, {
      props: {
        retryLabel: 'Try Again',
      },
    })

    const button = wrapper.find('button')
    expect(button.text()).toContain('Try Again')
  })

  it('hides retry button when hideRetry is true', () => {
    const wrapper = mount(ErrorState, {
      props: {
        hideRetry: true,
      },
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits retry event when button clicked', async () => {
    const wrapper = mount(ErrorState)

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('retry')).toBeTruthy()
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ErrorState)

    // Check for role="alert"
    expect(wrapper.attributes('role')).toBe('alert')

    // Check for icon with aria-hidden
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('accepts optional id prop', () => {
    const wrapper = mount(ErrorState, {
      props: {
        id: 'dashboard-error',
      },
    })

    expect(wrapper.attributes('id')).toBe('dashboard-error')
  })
})
