import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LessonContent from '~/components/lesson/LessonContent.vue'

// Mock marked
vi.mock('marked', () => ({
  marked: {
    parse: (content: string) => `<p>${content}</p>`,
  },
}))

// Mock Tabs component - نمایش همه slot‌ها
vi.mock('~/components/ui/Tabs.vue', () => ({
  default: {
    name: 'Tabs',
    props: ['tabs', 'ariaLabel'],
    template: `
      <div class="tabs-mock" :aria-label="ariaLabel">
        <div data-testid="tab-content"><slot name="content" /></div>
        <div data-testid="tab-resources"><slot name="resources" /></div>
        <div data-testid="tab-notes"><slot name="notes" /></div>
      </div>
    `,
  },
}))

// Mock lesson progress store
vi.mock('~/stores/lesson-progress', () => ({
  useLessonProgressStore: () => ({
    getNote: vi.fn(() => ''),
    saveNote: vi.fn(),
    progress: {},
  }),
}))

describe('LessonContent', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockLesson = {
    id: 1,
    title: 'Test Lesson',
    slug: 'test-lesson',
    content: '# Hello World',
    duration: '10:00',
    courseId: 1,
    sectionId: 1,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // ═══════════════════════════════════════
  // Content Tab
  // ═══════════════════════════════════════
  describe('content tab', () => {
    it('should render lesson content', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const contentTab = wrapper.find('[data-testid="tab-content"]')
      expect(contentTab.html()).toContain('Hello World')
    })

    it('should show placeholder when no content', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: { ...mockLesson, content: '' } },
      })

      const contentTab = wrapper.find('[data-testid="tab-content"]')
      expect(contentTab.text()).toContain('Content for this lesson will be added soon')
    })

    it('should render null lesson gracefully', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: null },
      })

      const contentTab = wrapper.find('[data-testid="tab-content"]')
      expect(contentTab.text()).toContain('Content for this lesson will be added soon')
    })
  })

  // ═══════════════════════════════════════
  // Notes Tab
  // ═══════════════════════════════════════
  describe('notes tab', () => {
    it('should have a textarea for notes', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('should have a save button', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      expect(wrapper.find('button').text()).toContain('Save Notes')
    })

    it('should update textarea value on input', async () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('My test notes')

      expect((textarea.element as HTMLTextAreaElement).value).toBe('My test notes')
    })
  })

  // ═══════════════════════════════════════
  // Resources Tab
  // ═══════════════════════════════════════
  describe('resources tab', () => {
    it('should show sample resources', () => {
      // بر اساس کد کامپوننت، همیشه sampleResources نمایش داده می‌شود
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const resourcesTab = wrapper.find('[data-testid="tab-resources"]')
      expect(resourcesTab.text()).toContain('Project Source Code')
      expect(resourcesTab.text()).toContain('Presentation Slides')
    })

    it('should display resource sizes', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const resourcesTab = wrapper.find('[data-testid="tab-resources"]')
      expect(resourcesTab.text()).toContain('2.4 MB')
      expect(resourcesTab.text()).toContain('1.1 MB')
    })

    it('should have download links for resources', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const downloadLinks = wrapper.findAll('[data-testid="tab-resources"] a[download]')
      expect(downloadLinks.length).toBe(2)
    })
  })

  // ═══════════════════════════════════════
  // Accessibility
  // ═══════════════════════════════════════
  describe('accessibility', () => {
    it('should have label for textarea', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const textarea = wrapper.find('textarea')
      const label = wrapper.find('label[for="lesson-notes"]')

      expect(textarea.attributes('id')).toBe('lesson-notes')
      expect(label.exists()).toBe(true)
    })

    it('should have aria-label on tabs', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      // The Tabs component should have aria-label
      expect(wrapper.html()).toContain('aria-label')
    })

    it('should have aria-label on resources list', () => {
      const wrapper = mount(LessonContent, {
        props: { lesson: mockLesson },
      })

      const resourcesList = wrapper.find('[aria-label="Downloadable resources"]')
      expect(resourcesList.exists()).toBe(true)
    })
  })
})