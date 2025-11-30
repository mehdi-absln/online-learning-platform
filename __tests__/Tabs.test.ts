import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from '~/components/Tabs.vue'

describe('Tabs.vue', () => {
  const tabsProp = [
    { title: 'Tab 1', name: 'tab1' },
    { title: 'Tab 2', name: 'tab2' }
  ]

  const slots = {
    tab1: '<div data-testid="tab1-content">Content of Tab 1</div>',
    tab2: '<div data-testid="tab2-content">Content of Tab 2</div>'
  }

  it('renders tabs with correct titles', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: tabsProp,
        modelValue: 0
      },
      slots
    })

    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons).toHaveLength(2)
    expect(tabButtons[0].text()).toBe('Tab 1')
    expect(tabButtons[1].text()).toBe('Tab 2')
  })

  it('displays the first tab content by default', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: tabsProp,
        modelValue: 0
      },
      slots
    })

    // Check that the first tab is active
    const firstTabButton = wrapper.get('[role="tab"]').element as HTMLElement
    expect(firstTabButton.getAttribute('aria-selected')).toBe('true')

    // Check that the first tab panel is visible
    const tab1Content = wrapper.find('[data-testid="tab1-content"]')
    expect(tab1Content.exists()).toBe(true)
    expect(tab1Content.isVisible()).toBe(true)
  })

  it('switches to second tab when clicked', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: tabsProp,
        modelValue: 0
      },
      slots
    })

    // Click on the second tab
    const secondTabButton = wrapper.findAll('[role="tab"]')[1]
    await secondTabButton.trigger('click')

    // Check that the second tab is now active
    expect(secondTabButton.attributes('aria-selected')).toBe('true')

    // Check that the first tab panel is hidden
    const tab1Panel = wrapper.findAll('[role="tabpanel"]')[0]
    expect(tab1Panel.element.hidden).toBe(true)

    // Check that the second tab panel is now visible
    const tab2Panel = wrapper.findAll('[role="tabpanel"]')[1]
    expect(tab2Panel.element.hidden).toBe(false)
  })

  it('emits update:modelValue when tab is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: tabsProp,
        modelValue: 0
      },
      slots
    })

    // Click on the second tab
    const secondTabButton = wrapper.findAll('[role="tab"]')[1]
    await secondTabButton.trigger('click')

    // Check that the update:modelValue event was emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0]
    expect(emittedValue).toBe(1)
  })

  it('uses correct aria attributes', () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: tabsProp,
        modelValue: 0
      },
      slots
    })

    const tabButtons = wrapper.findAll('[role="tab"]')
    const tabPanels = wrapper.findAll('[role="tabpanel"]')

    // Check first tab and panel
    expect(tabButtons[0].attributes('aria-selected')).toBe('true')
    expect(tabButtons[0].attributes('aria-controls')).toBe(tabPanels[0].attributes('id'))
    expect(tabPanels[0].attributes('aria-labelledby')).toBe(tabButtons[0].attributes('id'))
    expect(tabPanels[0].element.hidden).toBe(false)

    // Check second tab and panel
    expect(tabButtons[1].attributes('aria-selected')).toBe('false')
    expect(tabButtons[1].attributes('aria-controls')).toBe(tabPanels[1].attributes('id'))
    expect(tabPanels[1].attributes('aria-labelledby')).toBe(tabButtons[1].attributes('id'))
    expect(tabPanels[1].element.hidden).toBe(true)
  })
})
