import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CourseFilterCheckbox from '@/components/courses/CourseFilterCheckbox.vue'

describe('CourseFilterCheckbox', () => {
  // Test with boolean model (single selection)
  it('renders correctly with boolean model', () => {
    const wrapper = mount(CourseFilterCheckbox, {
      props: {
        id: 'test-checkbox',
        label: 'Test Label',
        modelValue: true,
      },
    })

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })

  it('emits update:modelValue event with boolean value', async () => {
    const wrapper = mount(CourseFilterCheckbox, {
      props: {
        id: 'test-checkbox',
        label: 'Test Label',
        modelValue: false,
      },
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  // Test with string array model (multi-selection)
  it('renders correctly with string array model', () => {
    const wrapper = mount(CourseFilterCheckbox, {
      props: {
        id: 'test-checkbox',
        label: 'Test Label',
        modelValue: ['option1', 'option2'],
        value: 'option1',
      },
    })

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })

  it('emits update:modelValue event with string array value', async () => {
    const wrapper = mount(CourseFilterCheckbox, {
      props: {
        id: 'test-checkbox',
        label: 'Test Label',
        modelValue: ['option1'],
        value: 'option2',
      },
    })

    await wrapper.find('input[type="checkbox"]').setValue()

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option1', 'option2']])
  })

  it('removes value from array when unchecked in string array model', async () => {
    const wrapper = mount(CourseFilterCheckbox, {
      props: {
        id: 'test-checkbox',
        label: 'Test Label',
        modelValue: ['option1', 'option2'],
        value: 'option1',
      },
    })

    await wrapper.find('input[type="checkbox"]').setValue(false)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option2']])
  })
})