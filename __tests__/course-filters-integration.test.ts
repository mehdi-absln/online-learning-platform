import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref, nextTick } from 'vue'
import { useCoursesStore } from '~/stores/courses'
import type { CoursesFilter } from '~/types/courses-filter'
import { extractParamsFromUrl } from '~/utils/course-helpers'

// Mock the router
const mockReplace = vi.fn()

// Mock useFetch response
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

// Define route ref
const mockRoute = ref({
  fullPath: '/courses',
  query: {} as Record<string, unknown>,
})

// ✅ Mock lodash-es debounce BEFORE imports
vi.mock('lodash-es', () => ({
  debounce: (fn: (...args: unknown[]) => unknown) => {
    const debouncedFn = (...args: unknown[]) => fn(...args)
    debouncedFn.cancel = vi.fn()
    debouncedFn.flush = vi.fn()
    return debouncedFn
  },
}))

// ✅ Mock Nuxt auto-imports as globals
vi.stubGlobal('useRouter', () => ({ replace: mockReplace }))
vi.stubGlobal('useRoute', () => mockRoute.value)
vi.stubGlobal('useFetch', () => mockUseFetchResponse)
vi.stubGlobal('onUnmounted', vi.fn())

// ✅ Mock watch از vue برای جلوگیری از اجرای واقعی
vi.stubGlobal('watch', vi.fn())

describe('Course Filters - Integration Tests', () => {
  let pinia: ReturnType<typeof createPinia>
  let coursesStore: ReturnType<typeof useCoursesStore>

  beforeEach(() => {
    vi.clearAllMocks()

    mockRoute.value = {
      fullPath: '/courses',
      query: {},
    }

    pinia = createPinia()
    setActivePinia(pinia)
    coursesStore = useCoursesStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ========================================
  // تست‌های Store (مستقیم)
  // ========================================

  describe('Store Actions', () => {
    it('setFilter باید فیلتر را در store ذخیره کند', () => {
      const newFilter: CoursesFilter = { categories: ['Design'] }

      coursesStore.setFilter(newFilter)

      expect(coursesStore.currentFilter).toEqual({ categories: ['Design'] })
      expect(coursesStore.currentPage).toBe(1)
      expect(coursesStore.loading).toBe(true)
    })

    it('setPage باید صفحه را تغییر دهد', () => {
      coursesStore.setPage(3)

      expect(coursesStore.currentPage).toBe(3)
      expect(coursesStore.loading).toBe(true)
    })

    it('changePage باید صفحه را در محدوده مجاز تغییر دهد', () => {
      coursesStore.setPagination({
        currentPage: 1,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 12,
      })

      coursesStore.changePage(2)
      expect(coursesStore.currentPage).toBe(2)

      // صفحه نامعتبر نباید تغییر کند
      coursesStore.changePage(10)
      expect(coursesStore.currentPage).toBe(2)
    })

    it('resetFilter باید همه فیلترها را پاک کند', () => {
      coursesStore.setFilter({
        categories: ['Design'],
        levels: ['Advanced'],
      })
      coursesStore.setPage(3)

      coursesStore.resetFilter()

      expect(coursesStore.currentFilter).toEqual({})
      expect(coursesStore.currentPage).toBe(1)
    })

    it('hasActiveFilters باید درست کار کند', () => {
      expect(coursesStore.hasActiveFilters).toBe(false)

      coursesStore.setFilter({ categories: ['Design'] })
      expect(coursesStore.hasActiveFilters).toBe(true)

      coursesStore.resetFilter()
      expect(coursesStore.hasActiveFilters).toBe(false)
    })
  })

  // ========================================
  // تست‌های URL Parser
  // ========================================

  describe('extractParamsFromUrl', () => {
    it('باید فیلتر خالی برای URL خالی برگرداند', () => {
      const params = extractParamsFromUrl({})

      expect(params.filter).toEqual({})
      expect(params.page).toBe(1)
      expect(params.limit).toBe(12)
    })

    it('باید category را به آرایه تبدیل کند', () => {
      const params = extractParamsFromUrl({ categories: 'Design' })

      expect(params.filter.categories).toEqual(['Design'])
    })

    it('باید آرایه categories را درست parse کند', () => {
      const params = extractParamsFromUrl({
        categories: ['Design', 'Development'],
      })

      expect(params.filter.categories).toEqual(['Design', 'Development'])
    })

    it('باید page و limit را درست parse کند', () => {
      const params = extractParamsFromUrl({
        page: '3',
        limit: '24',
      })

      expect(params.page).toBe(3)
      expect(params.limit).toBe(24)
    })

    it('باید priceFilter را از freeOnly درست بخواند', () => {
      const params = extractParamsFromUrl({ freeOnly: 'true' })

      expect(params.filter.priceFilter).toBe('free')
    })

    it('باید priceFilter را از paidOnly درست بخواند', () => {
      const params = extractParamsFromUrl({ paidOnly: 'true' })

      expect(params.filter.priceFilter).toBe('paid')
    })

    it('باید searchQuery را درست بخواند', () => {
      const params = extractParamsFromUrl({ q: 'javascript' })

      expect(params.filter.searchQuery).toBe('javascript')
    })

    it('باید همه پارامترها را با هم parse کند', () => {
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
  // تست‌های Integration (URL ↔ Store)
  // ========================================

  describe('URL to Store Integration', () => {
    it('تغییر URL با page=3 باید store را آپدیت کند', () => {
      mockRoute.value = {
        fullPath: '/courses?page=3',
        query: { page: '3' },
      }

      const urlParams = extractParamsFromUrl(mockRoute.value.query)
      coursesStore.setFilter(urlParams.filter)
      coursesStore.setPage(urlParams.page)

      expect(coursesStore.currentPage).toBe(3)
    })

    it('تغییر URL با filter+page باید هر دو را آپدیت کند', () => {
      mockRoute.value = {
        fullPath: '/courses?categories=Design&page=2',
        query: {
          categories: 'Design',
          page: '2',
        },
      }

      const urlParams = extractParamsFromUrl(mockRoute.value.query)
      coursesStore.setFilter(urlParams.filter)
      coursesStore.setPage(urlParams.page)

      expect(coursesStore.currentFilter.categories).toEqual(['Design'])
      expect(coursesStore.currentPage).toBe(2)
    })

    it('Reload صفحه با فیلترهای متعدد', () => {
      mockRoute.value = {
        fullPath: '/courses?categories=Design&levels=Advanced&page=2',
        query: {
          categories: 'Design',
          levels: 'Advanced',
          page: '2',
        },
      }

      const urlParams = extractParamsFromUrl(mockRoute.value.query)
      coursesStore.setFilter(urlParams.filter)
      coursesStore.setPage(urlParams.page)

      expect(coursesStore.currentFilter.categories).toEqual(['Design'])
      expect(coursesStore.currentFilter.levels).toEqual(['Advanced'])
      expect(coursesStore.currentPage).toBe(2)
    })
  })

  // ========================================
  // تست‌های Getters
  // ========================================

  describe('Store Getters', () => {
    it('isEmpty باید true باشد وقتی courses خالی است', () => {
      expect(coursesStore.isEmpty).toBe(true)

      coursesStore.setCourses([{ id: 1, title: 'Test' } as any])
      expect(coursesStore.isEmpty).toBe(false)
    })

    it('hasMorePages باید درست کار کند', () => {
      coursesStore.setPagination({
        currentPage: 1,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 12,
      })

      expect(coursesStore.hasMorePages).toBe(true)

      coursesStore.setPage(5)
      expect(coursesStore.hasMorePages).toBe(false)
    })

    it('paginationInfo باید اطلاعات صحیح برگرداند', () => {
      coursesStore.setPagination({
        currentPage: 2,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 12,
      })

      const info = coursesStore.paginationInfo

      expect(info.currentPage).toBe(2)
      expect(info.totalPages).toBe(5)
      expect(info.from).toBe(13)
      expect(info.to).toBe(24)
    })
  })

  // ========================================
  // تست‌های cleanFilter
  // ========================================

  describe('cleanFilter behavior', () => {
    it('باید فیلدهای خالی را حذف کند', () => {
      coursesStore.setFilter({
        categories: [],
        levels: ['Advanced'],
        tags: [],
        searchQuery: '',
      })

      // cleanFilter باید categories, tags و searchQuery خالی را حذف کند
      expect(coursesStore.currentFilter).toEqual({
        levels: ['Advanced'],
      })
    })

    it('باید undefined ها را حفظ نکند', () => {
      coursesStore.setFilter({
        categories: ['Design'],
        instructorId: undefined,
        minPrice: undefined,
      })

      expect(coursesStore.currentFilter).toEqual({
        categories: ['Design'],
      })
      expect(coursesStore.currentFilter.instructorId).toBeUndefined()
    })
  })
})
