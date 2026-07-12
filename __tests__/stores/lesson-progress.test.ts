import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLessonProgressStore } from '~/stores/lesson-progress'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('useLessonProgressStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockFetch.mockReset()
  })

  // ═══════════════════════════════════════
  // Initial State
  // ═══════════════════════════════════════
  describe('initial state', () => {
    it('should have empty progress on init', () => {
      const store = useLessonProgressStore()

      expect(store.progress).toEqual({})
      expect(store.isLoading).toBe(false)
      expect(store.isInitialized).toBe(false)
    })

    it('should return false for isCompleted when no progress', () => {
      const store = useLessonProgressStore()

      expect(store.isCompleted(1)).toBe(false)
      expect(store.isCompleted(999)).toBe(false)
    })

    it('should return false for isBookmarked when no progress', () => {
      const store = useLessonProgressStore()

      expect(store.isBookmarked(1)).toBe(false)
    })

    it('should return empty string for getNote when no progress', () => {
      const store = useLessonProgressStore()

      expect(store.getNote(1)).toBe('')
    })

    it('should have empty completedLessonIds', () => {
      const store = useLessonProgressStore()

      expect(store.completedLessonIds).toEqual([])
      expect(store.completedCount).toBe(0)
    })
  })

  // ═══════════════════════════════════════
  // fetchProgress
  // ═══════════════════════════════════════
  describe('fetchProgress', () => {
    it('should fetch and transform progress data', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: {
          progress: [
            { lessonId: 1, isCompleted: true, isBookmarked: false },
            { lessonId: 2, isCompleted: false, isBookmarked: true },
          ],
        },
      })

      await store.fetchProgress()

      expect(store.progress[1]).toEqual({ lessonId: 1, isCompleted: true, isBookmarked: false })
      expect(store.progress[2]).toEqual({ lessonId: 2, isCompleted: false, isBookmarked: true })
      expect(store.isInitialized).toBe(true)
    })

    it('should not fetch twice if already initialized', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: [] },
      })

      await store.fetchProgress()
      await store.fetchProgress()

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should set isLoading during fetch', async () => {
      const store = useLessonProgressStore()

      let loadingDuringFetch = false
      mockFetch.mockImplementationOnce(async () => {
        loadingDuringFetch = store.isLoading
        return { success: true, data: { progress: [] } }
      })

      await store.fetchProgress()

      expect(loadingDuringFetch).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should handle fetch error gracefully', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await store.fetchProgress()

      // Current behavior: error is captured into state (no console.error).
      // isInitialized stays false so the caller can retry; isLoading clears.
      expect(store.error).toBe('Network error')
      expect(store.hasError).toBe(true)
      expect(store.isLoading).toBe(false)
      expect(store.isInitialized).toBe(false)
    })
  })

  // ═══════════════════════════════════════
  // toggleComplete
  // ═══════════════════════════════════════
  describe('toggleComplete', () => {
    it('should optimistically update completion status', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isCompleted: true } },
      })

      const promise = store.toggleComplete(1)

      // Optimistic update should happen immediately
      expect(store.isCompleted(1)).toBe(true)

      await promise
    })

    it('should toggle from completed to incomplete', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 }

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isCompleted: false } },
      })

      await store.toggleComplete(1)

      expect(store.isCompleted(1)).toBe(false)
    })

    it('should revert on API error', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: false, isBookmarked: false, progressPercentage: 0 }

      mockFetch.mockRejectedValueOnce(new Error('API error'))

      await store.toggleComplete(1)

      // Should revert to original state
      expect(store.isCompleted(1)).toBe(false)
    })

    it('should set progressPercentage to 100 when completed', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isCompleted: true, progressPercentage: 100 } },
      })

      await store.toggleComplete(1)

      expect(store.progress[1].progressPercentage).toBe(100)
    })

    it('should call correct API endpoint', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({ success: true, data: { progress: {} } })

      await store.toggleComplete(5)

      expect(mockFetch).toHaveBeenCalledWith('/api/progress/complete', {
        method: 'POST',
        body: { lessonId: 5 },
      })
    })
  })

  // ═══════════════════════════════════════
  // toggleBookmark
  // ═══════════════════════════════════════
  describe('toggleBookmark', () => {
    it('should optimistically update bookmark status', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isBookmarked: true } },
      })

      const promise = store.toggleBookmark(1)

      expect(store.isBookmarked(1)).toBe(true)

      await promise
    })

    it('should toggle from bookmarked to unbookmarked', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: false, isBookmarked: true, progressPercentage: 0 }

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isBookmarked: false } },
      })

      await store.toggleBookmark(1)

      expect(store.isBookmarked(1)).toBe(false)
    })

    it('should revert on API error', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: false, isBookmarked: true, progressPercentage: 0 }

      mockFetch.mockRejectedValueOnce(new Error('API error'))

      await store.toggleBookmark(1)

      expect(store.isBookmarked(1)).toBe(true)
    })

    it('should preserve other properties when toggling bookmark', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = {
        lessonId: 1,
        isCompleted: true,
        isBookmarked: false,
        notes: 'my notes',
        progressPercentage: 100,
      }

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, isCompleted: true, isBookmarked: true, notes: 'my notes' } },
      })

      await store.toggleBookmark(1)

      expect(store.progress[1].isCompleted).toBe(true)
      expect(store.progress[1].notes).toBe('my notes')
    })
  })

  // ═══════════════════════════════════════
  // saveNote
  // ═══════════════════════════════════════
  describe('saveNote', () => {
    it('should save note optimistically', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, notes: 'Test note' } },
      })

      const promise = store.saveNote(1, 'Test note')

      expect(store.getNote(1)).toBe('Test note')

      await promise
    })

    it('should update existing note', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: false, isBookmarked: false, notes: 'Old note', progressPercentage: 0 }

      mockFetch.mockResolvedValueOnce({
        success: true,
        data: { progress: { lessonId: 1, notes: 'New note' } },
      })

      await store.saveNote(1, 'New note')

      expect(store.getNote(1)).toBe('New note')
    })

    it('should revert on API error', async () => {
      const store = useLessonProgressStore()
      store.progress[1] = { lessonId: 1, isCompleted: false, isBookmarked: false, notes: 'Original note', progressPercentage: 0 }

      mockFetch.mockRejectedValueOnce(new Error('API error'))

      await store.saveNote(1, 'New note')

      expect(store.getNote(1)).toBe('Original note')
    })

    it('should call correct API endpoint with notes', async () => {
      const store = useLessonProgressStore()

      mockFetch.mockResolvedValueOnce({ success: true, data: { progress: {} } })

      await store.saveNote(5, 'My lesson notes')

      expect(mockFetch).toHaveBeenCalledWith('/api/progress/notes', {
        method: 'POST',
        body: { lessonId: 5, notes: 'My lesson notes' },
      })
    })
  })

  // ═══════════════════════════════════════
  // getProgressForCourse
  // ═══════════════════════════════════════
  describe('getProgressForCourse', () => {
    it('should calculate course progress correctly', () => {
      const store = useLessonProgressStore()
      store.progress = {
        1: { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
        2: { lessonId: 2, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
        3: { lessonId: 3, isCompleted: false, isBookmarked: false, progressPercentage: 0 },
      }

      const result = store.getProgressForCourse([1, 2, 3, 4])

      expect(result.completed).toBe(2)
      expect(result.total).toBe(4)
      expect(result.percentage).toBe(50)
    })

    it('should return 0% for empty lesson list', () => {
      const store = useLessonProgressStore()

      const result = store.getProgressForCourse([])

      expect(result.completed).toBe(0)
      expect(result.total).toBe(0)
      expect(result.percentage).toBe(0)
    })

    it('should return 100% when all lessons completed', () => {
      const store = useLessonProgressStore()
      store.progress = {
        1: { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
        2: { lessonId: 2, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
      }

      const result = store.getProgressForCourse([1, 2])

      expect(result.percentage).toBe(100)
    })

    it('should handle lessons not in progress', () => {
      const store = useLessonProgressStore()

      const result = store.getProgressForCourse([1, 2, 3])

      expect(result.completed).toBe(0)
      expect(result.percentage).toBe(0)
    })
  })

  // ═══════════════════════════════════════
  // reset
  // ═══════════════════════════════════════
  describe('reset', () => {
    it('should reset all state', () => {
      const store = useLessonProgressStore()
      store.progress = { 1: { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 } }
      store.isInitialized = true

      store.reset()

      expect(store.progress).toEqual({})
      expect(store.isInitialized).toBe(false)
    })
  })

  // ═══════════════════════════════════════
  // Computed: completedLessonIds
  // ═══════════════════════════════════════
  describe('completedLessonIds', () => {
    it('should return array of completed lesson IDs', () => {
      const store = useLessonProgressStore()
      store.progress = {
        1: { lessonId: 1, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
        2: { lessonId: 2, isCompleted: false, isBookmarked: false, progressPercentage: 0 },
        3: { lessonId: 3, isCompleted: true, isBookmarked: false, progressPercentage: 100 },
      }

      expect(store.completedLessonIds).toEqual([1, 3])
      expect(store.completedCount).toBe(2)
    })
  })
})
