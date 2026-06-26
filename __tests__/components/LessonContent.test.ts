import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import LessonContent from '~/components/lesson/LessonContent.vue'

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

  const createWrapper = (lesson = mockLesson) => mount(LessonContent, {
    props: { lesson },
    global: {
      stubs: {
        MarkdownRenderer: {
          props: ['content'],
          template: '<div data-testid="markdown">{{ content }}</div>',
        },
        EmptyState: {
          props: ['title', 'message'],
          template: '<div role="status">{{ message }}</div>',
        },
      },
    },
  })

  const getActivePanel = (wrapper: ReturnType<typeof createWrapper>) =>
    wrapper.find('[role="tabpanel"]:not([hidden])')

  const clickTab = async (wrapper: ReturnType<typeof createWrapper>, index: number) => {
    await wrapper.findAll('[role="tab"]')[index].trigger('click')
    await nextTick()
  }

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
      const wrapper = createWrapper()

      expect(getActivePanel(wrapper).text()).toContain('# Hello World')
    })

    it('should show placeholder when no content', () => {
      const wrapper = createWrapper({ ...mockLesson, content: '' })

      expect(getActivePanel(wrapper).text()).toContain('Content for this lesson will be added soon')
    })

    it('should render null lesson gracefully', () => {
      const wrapper = createWrapper(null)

      expect(getActivePanel(wrapper).text()).toContain('Content for this lesson will be added soon')
    })
  })

  // ═══════════════════════════════════════
  // Notes Tab
  // ═══════════════════════════════════════
  describe('notes tab', () => {
    it('should have a textarea for notes', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 2)

      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('should have a save button', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 2)

      expect(wrapper.find('button:not([role="tab"])').text()).toContain('Save Notes')
    })

    it('should update textarea value on input', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 2)

      const textarea = wrapper.find('textarea')
      await textarea.setValue('My test notes')

      expect((textarea.element as HTMLTextAreaElement).value).toBe('My test notes')
    })
  })

  // ═══════════════════════════════════════
  // Resources Tab
  // ═══════════════════════════════════════
  describe('resources tab', () => {
    it('should show sample resources', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 1)

      const resourcesTab = getActivePanel(wrapper)
      expect(resourcesTab.text()).toContain('Project Source Code')
      expect(resourcesTab.text()).toContain('Presentation Slides')
    })

    it('should display resource sizes', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 1)

      const resourcesTab = getActivePanel(wrapper)
      expect(resourcesTab.text()).toContain('2.4 MB')
      expect(resourcesTab.text()).toContain('1.1 MB')
    })

    it('should have download links for resources', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 1)

      const downloadLinks = getActivePanel(wrapper).findAll('a[download]')
      expect(downloadLinks.length).toBe(2)
    })
  })

  // ═══════════════════════════════════════
  // Accessibility
  // ═══════════════════════════════════════
  describe('accessibility', () => {
    it('should have label for textarea', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 2)

      const textarea = wrapper.find('textarea')
      const label = wrapper.find('label[for="lesson-notes"]')

      expect(textarea.attributes('id')).toBe('lesson-notes')
      expect(label.exists()).toBe(true)
    })

    it('should have aria-label on tabs', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[role="tablist"]').attributes('aria-label')).toBe('Lesson content sections')
    })

    it('should have aria-label on resources list', async () => {
      const wrapper = createWrapper()
      await clickTab(wrapper, 1)

      const resourcesList = wrapper.find('[aria-label="Downloadable resources"]')
      expect(resourcesList.exists()).toBe(true)
    })
  })
})
