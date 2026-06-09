import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo', () => {
  it('renders correctly with video URL', () => {
    const wrapper = mount(LessonVideo, {
      props: {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Test Video'
      }
    })
    
    expect(wrapper.find('iframe').exists()).toBe(true)
    expect(wrapper.find('iframe').attributes('src')).toContain('youtube.com/embed/')
  })
  
  it('shows placeholder when no video URL is provided', () => {
    const wrapper = mount(LessonVideo, {
      props: {
        title: 'Test Video'
      }
    })
    
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.text()).toContain('This lesson contains only text content')
  })
})