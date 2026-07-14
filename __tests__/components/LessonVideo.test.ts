import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo', () => {
  // ═══════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════
  describe('rendering', () => {
    it('should show a video facade (thumbnail + play button) when videoUrl is provided', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Test Video',
        },
      })

      // The component uses a click-to-load facade: the iframe is NOT rendered
      // until the user clicks the play button.
      expect(wrapper.find('iframe').exists()).toBe(false)
      // The play button / facade should be present.
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
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

    it('should render the iframe only after clicking the play button', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Test Video',
        },
      })

      // Facade visible first, iframe hidden
      expect(wrapper.find('iframe').exists()).toBe(false)

      await wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('iframe').exists()).toBe(true)
    })
  })

  // ═══════════════════════════════════════
  // YouTube URL Conversion (after load)
  // ═══════════════════════════════════════
  describe('YouTube URL conversion', () => {
    const loadAndGetIframe = async (videoUrl: string) => {
      const wrapper = mount(LessonVideo, {
        props: { videoUrl, title: 'Test Video' },
      })
      await wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      return wrapper.find('iframe')
    }

    it('should convert youtube.com/watch?v= format', async () => {
      const iframe = await loadAndGetIframe('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1')
    })

    it('should convert youtu.be/ format', async () => {
      const iframe = await loadAndGetIframe('https://youtu.be/dQw4w9WgXcQ')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1')
    })

    it('should handle youtu.be/ with query params', async () => {
      const iframe = await loadAndGetIframe('https://youtu.be/dQw4w9WgXcQ?t=30')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1')
    })

    it('should pass through already embed format', async () => {
      const iframe = await loadAndGetIframe('https://www.youtube.com/embed/dQw4w9WgXcQ')
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should handle invalid URL gracefully', async () => {
      const iframe = await loadAndGetIframe('not-a-valid-url')
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
