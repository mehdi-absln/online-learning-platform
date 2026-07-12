import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonVideo from '~/components/lesson/LessonVideo.vue'

describe('LessonVideo', () => {
  // ═══════════════════════════════════════
  // Rendering
  //
  // Note: the component now uses a "facade" / lazy-load pattern. Instead of
  // rendering an iframe immediately, it shows a thumbnail + play button and
  // only mounts the iframe once the user clicks loadVideo(). These tests
  // assert the new behavior (facade first, iframe after click).
  // ═══════════════════════════════════════
  describe('rendering', () => {
    it('shows a play facade when videoUrl is provided (no iframe yet)', () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Test Video',
        },
      })

      expect(wrapper.find('iframe').exists()).toBe(false)
      // Facade is a button the user clicks to load the iframe
      expect(wrapper.find('button[aria-label*="Load and play video"]').exists()).toBe(true)
    })

    it('mounts the iframe once the play facade is clicked', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Test Video',
        },
      })

      await wrapper.find('button[aria-label*="Load and play video"]').trigger('click')

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

    it('should set correct title on iframe after load', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=abc123',
          title: 'My Lesson Title',
        },
      })

      await wrapper.find('button[aria-label*="Load and play video"]').trigger('click')

      expect(wrapper.find('iframe').attributes('title')).toBe('My Lesson Title')
    })
  })

  // ═══════════════════════════════════════
  // YouTube URL Conversion
  //
  // The iframe is only mounted after the user clicks the facade. Each test
  // here exercises that interaction so we can inspect the resulting src.
  // ═══════════════════════════════════════
  describe('YouTube URL conversion', () => {
    const clickFacade = async (wrapper: ReturnType<typeof mount>) => {
      await wrapper.find('button[aria-label*="Load and play video"]').trigger('click')
    }

    it('should convert youtube.com/watch?v= format', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      })

      await clickFacade(wrapper)

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1',
      )
    })

    it('should convert youtu.be/ format', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
        },
      })

      await clickFacade(wrapper)

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1',
      )
    })

    it('should handle youtu.be/ with query params', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://youtu.be/dQw4w9WgXcQ?t=30',
        },
      })

      await clickFacade(wrapper)

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&autoplay=1',
      )
    })

    it('should pass through already embed format', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
      })

      await clickFacade(wrapper)

      const iframe = wrapper.find('iframe')
      // Already-embed URLs are not matched by the regex and pass through as-is.
      expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should handle invalid URL gracefully', async () => {
      const wrapper = mount(LessonVideo, {
        props: {
          videoUrl: 'not-a-valid-url',
        },
      })

      await clickFacade(wrapper)

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
