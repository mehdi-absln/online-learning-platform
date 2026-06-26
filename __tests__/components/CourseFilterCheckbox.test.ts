import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FilterCheckboxGroup from '~/components/courses/FilterCheckboxGroup.vue'

describe('CourseFilterCheckbox', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ]

  it('renders checkbox options', () => {
    const wrapper = mount(FilterCheckboxGroup, {
      props: {
        name: 'test-checkbox',
        options,
        modelValue: ['option1'],
      },
    })

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).toContain('Option 2')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })

  it('emits update:modelValue when checking a new value', async () => {
    const wrapper = mount(FilterCheckboxGroup, {
      props: {
        name: 'test-checkbox',
        options,
        modelValue: ['option1'],
      },
    })

    const checkbox = wrapper.findAll('input[type="checkbox"]')[1]
    await checkbox.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option1', 'option2']])
  })

  it('renders checked state from modelValue array', () => {
    const wrapper = mount(FilterCheckboxGroup, {
      props: {
        name: 'test-checkbox',
        options,
        modelValue: ['option1', 'option2'],
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes[0].element.checked).toBe(true)
    expect(checkboxes[1].element.checked).toBe(true)
  })

  it('emits update:modelValue when unchecking a selected value', async () => {
    const wrapper = mount(FilterCheckboxGroup, {
      props: {
        name: 'test-checkbox',
        options,
        modelValue: ['option1', 'option2'],
      },
    })

    await wrapper.findAll('input[type="checkbox"]')[0].setValue(false)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option2']])
  })

  it('treats undefined modelValue as empty selection', async () => {
    const wrapper = mount(FilterCheckboxGroup, {
      props: {
        name: 'test-checkbox',
        options,
        modelValue: undefined,
      },
    })

    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option1']])
  })
})
