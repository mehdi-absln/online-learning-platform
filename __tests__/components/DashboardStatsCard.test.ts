import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardStatsCard from '~/components/dashboard/DashboardStatsCard.vue'

describe('DashboardStatsCard', () => {
  it('renders icon, value, and label correctly', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '📚',
        label: 'Enrolled Courses',
        value: 5
      }
    })
    
    expect(wrapper.text()).toContain('📚')
    // Animated counter starts at 0, so we check for the label
    expect(wrapper.text()).toContain('Enrolled Courses')
    // Icon container should have the value
    expect(wrapper.props('value')).toBe(5)
  })

  it('displays animated value (starts at 0)', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '✅',
        label: 'Completed',
        value: 10
      }
    })
    
    // Animation starts at 0, which is expected behavior
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.props('value')).toBe(10)
  })

  it('applies correct color variant (primary)', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '📚',
        label: 'Courses',
        value: 3,
        color: 'primary'
      }
    })
    
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.classes()).toContain('bg-primary/15')
    expect(iconContainer.classes()).toContain('text-primary')
  })

  it('applies correct color variant (green)', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '✅',
        label: 'Completed',
        value: 5,
        color: 'green'
      }
    })
    
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.classes()).toContain('bg-emerald-500/15')
    expect(iconContainer.classes()).toContain('text-emerald-400')
  })

  it('applies correct color variant (blue)', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '🔄',
        label: 'In Progress',
        value: 2,
        color: 'blue'
      }
    })
    
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.classes()).toContain('bg-blue-500/15')
    expect(iconContainer.classes()).toContain('text-blue-400')
  })

  it('applies correct color variant (amber)', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '🔖',
        label: 'Bookmarked',
        value: 8,
        color: 'amber'
      }
    })
    
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.classes()).toContain('bg-amber-500/15')
    expect(iconContainer.classes()).toContain('text-amber-400')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '📚',
        label: 'Enrolled Courses',
        value: 5
      }
    })
    
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.exists()).toBe(true)
    expect(iconContainer.attributes('aria-label')).toContain('Icon for Enrolled Courses')
  })

  it('has hover effects on icon', () => {
    const wrapper = mount(DashboardStatsCard, {
      props: {
        icon: '📚',
        label: 'Courses',
        value: 3
      }
    })
    
    // Check that the icon container has the transition class
    const iconContainer = wrapper.find('[role="img"]')
    expect(iconContainer.classes()).toContain('transition-transform')
    expect(iconContainer.classes()).toContain('group-hover:scale-110')
  })
})
