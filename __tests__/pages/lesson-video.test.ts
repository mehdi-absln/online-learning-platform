import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo (page-level alias)', () => {
  // Mirrors the assertions in __tests__/components/LessonVideo.test.ts but
  // is a legacy/shorter entry point. Same facade-then-iframe semantics.

  it('shows a play facade first; mounts the iframe after click', async () => {
    const wrapper = mount(LessonVideo, {
      props: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Test Video',
      },
    })

    expect(wrapper.find('iframe').exists()).toBe(false)

    await wrapper.find('button[aria-label*="Load and play video"]').trigger('click')

    expect(wrapper.find('iframe').exists()).toBe(true)
    expect(wrapper.find('iframe').attributes('src')).toContain('youtube.com/embed/')
  })

  it('shows placeholder when no video URL is provided', () => {
    const wrapper = mount(LessonVideo, {
      props: {
        title: 'Test Video',
      },
    })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.text()).toContain('This lesson contains only text content')
  })
})
