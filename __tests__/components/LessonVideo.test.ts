import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo', () => {
  // ═══════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════
  describe('rendering', () => {
    it('should render iframe when videoUrl is provided', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Test Video',
        },
      })

      expect(wrapper.find('iframe').exists()).toBe(true)
    })

    it('should render placeholder when no videoUrl', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: undefined,
        },
      })

      expect(wrapper.find('iframe').exists()).toBe(false)
      expect(wrapper.text()).toContain('This lesson contains only text content')
    })

    it('should set correct title on iframe', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=abc123',
          title: 'My Lesson Title',
        },
      })

      expect(wrapper.find('iframe').attributes('title')).toBe('My Lesson Title')
    })
  })

  // ═══════════════════════════════════════
  // YouTube URL Conversion
  // ═══════════════════════════════════════
  describe('YouTube URL conversion', () => {
    it('should convert youtube.com/watch?v= format', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1')
    })

    it('should convert youtu.be/ format', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1')
    })

    it('should handle youtu.be/ with query params', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://youtu.be/dQw4w9WgXcQ?t=30',
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1')
    })

    it('should pass through already embed format', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should handle invalid URL gracefully', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'not-a-valid-url',
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe('not-a-valid-url')
    })
  })

  // ═══════════════════════════════════════
  // Accessibility
  // ═══════════════════════════════════════
  describe('accessibility', () => {
    it('should have aria-hidden on placeholder icon', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: undefined,
        },
      })

      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    })

    it('should have role="status" on placeholder', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: undefined,
        },
      })

      expect(wrapper.find('[role="status"]').exists()).toBe(true)
    })

    it('should have aria-label on video container', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=abc123',
          title: 'Test Video',
        },
      })

      expect(wrapper.find('figure').attributes('aria-label')).toContain('Test Video')
    })
  })
})
