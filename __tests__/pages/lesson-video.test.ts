import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo', () => {
  it('shows a video facade when given a video URL', () => {
    const wrapper = mount(LessonVideo, {
      props: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Test Video',
      },
    })

    // The component uses a click-to-load facade, so the iframe is not rendered
    // until the user clicks the play button.
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders the embed iframe after clicking the play button', async () => {
    const wrapper = mount(LessonVideo, {
      props: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Test Video',
      },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

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
