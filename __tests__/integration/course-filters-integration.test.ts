import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { extractParamsFromUrl } from '~/utils/course-helpers'

// Mock the router
const mockPush = vi.fn()

// Mock useFetch response (filter options)
const mockUseFetchResponse = {
  data: ref({
    data: {
      categories: ['Development', 'Design'],
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      tags: ['JavaScript', 'Vue', 'Nuxt'],
      instructors: [{ id: 1, name: 'John Doe' }],
    },
  }),
  pending: ref(false),
  error: ref(null),
}

// Define route ref — single source of truth for the composable
const mockRoute = ref({
  fullPath: '/courses',
  query: {} as Record<string, unknown>,
})

// Mock lodash-es debounce BEFORE imports
vi.mock('lodash-es', () => ({
  debounce: (fn: (...args: unknown[]) => unknown) => {
    const debouncedFn = (...args: unknown[]) => fn(...args)
    debouncedFn.cancel = vi.fn()
    debouncedFn.flush = vi.fn()
    return debouncedFn
  },
}))

const stateRefs: Record<string, ReturnType<typeof ref>> = {}

// `useCourseFilters` registers `onUnmounted(...)` under `if (import.meta.client)`,
// but this test invokes the composable directly (outside any component instance).
// The composable's `onUnmounted` is auto-imported from `vue`, so we must stub it
// at the module-resolution level to avoid Vue's
// "onUnmounted is called when there is no active component instance" warning.
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return { ...actual, onUnmounted: vi.fn() }
})

vi.mock('#imports', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('#imports')
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
    useRoute: () => mockRoute.value,
    useFetch: () => mockUseFetchResponse,
    onUnmounted: vi.fn(),
    watch: vi.fn(),
    useState: <T>(key: string, init: () => T) => {
      if (!stateRefs[key]) stateRefs[key] = ref(init())
      return stateRefs[key] as ReturnType<typeof ref<T>>
    },
  }
})

vi.mock('#app/composables/router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute.value,
}))

vi.stubGlobal('useRouter', () => ({ push: mockPush }))
vi.stubGlobal('useRoute', () => mockRoute.value)
vi.stubGlobal('useFetch', () => mockUseFetchResponse)
vi.stubGlobal('onUnmounted', vi.fn())
vi.stubGlobal('useState', <T>(key: string, init: () => T) => {
  if (!stateRefs[key]) stateRefs[key] = ref(init())
  return stateRefs[key] as ReturnType<typeof ref<T>>
})

describe('Course Filters - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockRoute.value = {
      fullPath: '/courses',
      query: {},
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ========================================
  // URL Parser tests (pure function, no mocking needed)
  // ========================================

  describe('extractParamsFromUrl', () => {
    it('should return an empty filter for an empty URL', () => {
      const params = extractParamsFromUrl({})

      expect(params.filter).toEqual({})
      expect(params.page).toBe(1)
      expect(params.limit).toBe(12)
    })

    it('should convert a single category string into an array', () => {
      const params = extractParamsFromUrl({ categories: 'Design' })

      expect(params.filter.categories).toEqual(['Design'])
    })

    it('should correctly parse an array of categories', () => {
      const params = extractParamsFromUrl({
        categories: ['Design', 'Development'],
      })

      expect(params.filter.categories).toEqual(['Design', 'Development'])
    })

    it('should correctly parse page and limit', () => {
      const params = extractParamsFromUrl({
        page: '3',
        limit: '24',
      })

      expect(params.page).toBe(3)
      expect(params.limit).toBe(24)
    })

    it('should read priceFilter from freeOnly', () => {
      const params = extractParamsFromUrl({ freeOnly: 'true' })

      expect(params.filter.priceFilter).toBe('free')
    })

    it('should read priceFilter from paidOnly', () => {
      const params = extractParamsFromUrl({ paidOnly: 'true' })

      expect(params.filter.priceFilter).toBe('paid')
    })

    it('should correctly read searchQuery', () => {
      const params = extractParamsFromUrl({ q: 'javascript' })

      expect(params.filter.searchQuery).toBe('javascript')
    })

    it('should parse all parameters together', () => {
      const params = extractParamsFromUrl({
        categories: ['Design'],
        levels: ['Advanced'],
        tags: ['vue', 'nuxt'],
        q: 'test',
        freeOnly: 'true',
        page: '2',
        limit: '24',
      })

      expect(params.filter.categories).toEqual(['Design'])
      expect(params.filter.levels).toEqual(['Advanced'])
      expect(params.filter.tags).toEqual(['vue', 'nuxt'])
      expect(params.filter.searchQuery).toBe('test')
      expect(params.filter.priceFilter).toBe('free')
      expect(params.page).toBe(2)
      expect(params.limit).toBe(24)
    })
  })

  // ========================================
  // Filter Navigation Actions
  // ========================================

  describe('Filter navigation', () => {
    it('applyFilters must push URL with filter query params', async () => {
      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { applyFilters } = useCourseFilters()

      applyFilters({ categories: ['Design'] })

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/courses',
          query: expect.objectContaining({ categories: 'Design', page: '1', limit: '12' }),
        }),
      )
    })

    it('resetFilters must push to /courses with no query', async () => {
      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { resetFilters } = useCourseFilters()

      resetFilters()

      expect(mockPush).toHaveBeenCalledWith({
        path: '/courses',
      })
    })

    it('changePage must push URL with updated page', async () => {
      mockRoute.value = {
        fullPath: '/courses?categories=Design',
        query: { categories: 'Design' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { changePage } = useCourseFilters()

      changePage(3)

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/courses',
          query: expect.objectContaining({ categories: 'Design', page: '3', limit: '12' }),
        }),
      )
    })
  })

  // ========================================
  // Computed Properties (driven by URL)
  // ========================================

  describe('Computed properties', () => {
    it('filter is derived from route query', async () => {
      mockRoute.value = {
        fullPath: '/courses?categories=Design&levels=Advanced',
        query: { categories: 'Design', levels: 'Advanced' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { filter } = useCourseFilters()

      expect(filter.value.categories).toEqual(['Design'])
      expect(filter.value.levels).toEqual(['Advanced'])
    })

    it('hasActiveFilters returns false for empty URL', async () => {
      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { hasActiveFilters } = useCourseFilters()

      expect(hasActiveFilters.value).toBe(false)
    })

    it('hasActiveFilters returns true when filters in URL', async () => {
      mockRoute.value = {
        fullPath: '/courses?categories=Design',
        query: { categories: 'Design' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { hasActiveFilters } = useCourseFilters()

      expect(hasActiveFilters.value).toBe(true)
    })

    it('currentPage is derived from URL page param', async () => {
      mockRoute.value = {
        fullPath: '/courses?page=3',
        query: { page: '3' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { currentPage } = useCourseFilters()

      expect(currentPage.value).toBe(3)
    })

    it('totalPages is computed from totalItems', async () => {
      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { setPagination, totalPages } = useCourseFilters()

      setPagination({ currentPage: 1, totalItems: 50, limit: 12 })
      // 50 / 12 = 4.17 → ceil = 5
      expect(totalPages.value).toBe(5)
    })

    it('hasNextPage and hasPrevPage work correctly', async () => {
      mockRoute.value = {
        fullPath: '/courses?page=2',
        query: { page: '2' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { setPagination, hasNextPage, hasPrevPage } = useCourseFilters()

      setPagination({ currentPage: 2, totalItems: 50, limit: 12 })
      expect(hasPrevPage.value).toBe(true)
      expect(hasNextPage.value).toBe(true) // 2 < 5

      // On last page
      mockRoute.value = {
        fullPath: '/courses?page=5',
        query: { page: '5' },
      }

      const { hasNextPage: hasNextPageLast } = useCourseFilters()
      expect(hasNextPageLast.value).toBe(false)
    })

    it('from and to are computed correctly', async () => {
      mockRoute.value = {
        fullPath: '/courses?page=2',
        query: { page: '2' },
      }

      const { useCourseFilters } = await import('~/composables/useCourseFilters')
      const { setPagination, from, to } = useCourseFilters()

      setPagination({ currentPage: 2, totalItems: 50, limit: 12 })
      expect(from.value).toBe(13)
      expect(to.value).toBe(24)
    })
  })
})
