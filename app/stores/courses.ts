import type { CoursesFilter } from '~/types/courses-filter'
import type { Course } from '~/types/shared/auth'
import type { DetailedCourse, CourseContentLesson } from '~/types/shared/courses'

export const useCoursesStore = defineStore('courses', () => {
  // ───── State ─────
  const courses = ref<Course[]>([])
  const detailedCourse = ref<DetailedCourse | null>(null)
  const loading = ref<boolean>(false)
  const currentFilter = ref<CoursesFilter>({})
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(12)
  const totalPages = ref<number>(1)
  const totalItems = ref<number>(0)

  // ───── Derived state ─────
  const hasActiveFilters = computed(() => {
    const f = currentFilter.value
    return (
      f.categories?.length
      || f.levels?.length
      || f.tags?.length
      || (f.priceFilter !== 'all' && f.priceFilter)
      || !!f.searchQuery
    )
  })

  const isEmpty = computed(() => courses.value.length === 0)
  const hasMorePages = computed(() => currentPage.value < totalPages.value)

  const paginationInfo = computed(() => ({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    totalItems: totalItems.value,
    itemsPerPage: itemsPerPage.value,
    from: (currentPage.value - 1) * itemsPerPage.value + 1,
    to: Math.min(currentPage.value * itemsPerPage.value, totalItems.value),
  }))

  // ───── Helpers ─────
  /** Remove empty values from filter object before storing or sending to URL/API */
  const cleanFilter = (filter: CoursesFilter): CoursesFilter => {
    const cleaned: CoursesFilter = {}
    if (filter.categories?.length) cleaned.categories = filter.categories
    if (filter.levels?.length) cleaned.levels = filter.levels
    if (filter.tags?.length) cleaned.tags = filter.tags
    if (filter.priceFilter && filter.priceFilter !== 'all') cleaned.priceFilter = filter.priceFilter
    if (filter.searchQuery) cleaned.searchQuery = filter.searchQuery
    if (filter.instructorId !== undefined) cleaned.instructorId = filter.instructorId
    if (filter.minPrice !== undefined) cleaned.minPrice = filter.minPrice
    if (filter.maxPrice !== undefined) cleaned.maxPrice = filter.maxPrice
    return cleaned
  }

  // ───── 🆕 Lesson Helpers ─────

  /** All lessons flattened */
  const allLessons = computed((): CourseContentLesson[] => {
    if (!detailedCourse.value?.courseContent) return []
    return detailedCourse.value.courseContent.flatMap(
      section => section.content || [],
    )
  })

  /** Total number of lessons */
  const totalLessons = computed(() => allLessons.value.length)

  /** IDs of all lessons */
  const allLessonIds = computed(() =>
    allLessons.value
      .map(l => l.id || 0)
      .filter(id => id > 0),
  )

  /** Find lesson by slug */
  const findLessonBySlug = (slug: string): CourseContentLesson | null => {
    return allLessons.value.find(l => l.slug === slug) || null
  }

  /** Find lesson index */
  const findLessonIndex = (slug: string): number => {
    return allLessons.value.findIndex(l => l.slug === slug)
  }

  /** Find section of a lesson */
  const findLessonSection = (slug: string) => {
    return detailedCourse.value?.courseContent?.find(s =>
      s.content?.some(l => l.slug === slug),
    ) || null
  }

  // ───── Actions ─────
  const resetFilter = () => {
    loading.value = true
    currentFilter.value = {}
    currentPage.value = 1
  }

  const setFilter = (filter: CoursesFilter) => {
    loading.value = true
    currentFilter.value = cleanFilter(filter)
    currentPage.value = 1 // Reset to first page on filter change
  }

  const setPage = (page: number) => {
    loading.value = true
    currentPage.value = page
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      loading.value = true
      currentPage.value = page
    }
  }

  const setCourses = (newCourses: Course[]) => {
    courses.value = newCourses
  }

  const setPagination = (pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }) => {
    currentPage.value = pagination.currentPage
    totalPages.value = pagination.totalPages
    totalItems.value = pagination.totalItems
    itemsPerPage.value = pagination.itemsPerPage
  }

  return {
    // State
    courses, detailedCourse, loading, currentFilter, currentPage,
    itemsPerPage, totalPages, totalItems,

    // Getters
    hasActiveFilters, isEmpty, hasMorePages, paginationInfo,

    // 🆕 Lesson Helpers
    allLessons, totalLessons, allLessonIds,
    findLessonBySlug, findLessonIndex, findLessonSection,

    // Actions
    resetFilter, setFilter, setPage, changePage,
    setCourses, setPagination,
  }
})
