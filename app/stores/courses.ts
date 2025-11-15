import type { Course } from '~/types/shared/courses'
import type { DetailedCourse } from '~/types/shared/courses'
import type { CoursesFilter } from '~/types/courses-filter'
import type { CourseListResponse, CourseDetailResponse } from '~/types/shared/api'

export const useCoursesStore = defineStore('courses', () => {
  // State
  const courses = ref<Course[]>([])
  const detailedCourse = ref<DetailedCourse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const currentFilter = ref<CoursesFilter>({})
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(12)
  const totalPages = ref<number>(1)
  const totalItems = ref<number>(0)

  // Helper function to build query parameters from filter
  const buildQueryParams = (filter: CoursesFilter, page: number, limit: number) => {
    const queryParams = new URLSearchParams()
    if (filter.category) queryParams.append('category', filter.category)
    if (filter.categories?.length)
      filter.categories.forEach((c) => queryParams.append('categories', c))
    if (filter.level) queryParams.append('level', filter.level)
    if (filter.levels?.length) filter.levels.forEach((l) => queryParams.append('levels', l))
    if (filter.tags?.length) filter.tags.forEach((t) => queryParams.append('tags', t))
    if (filter.freeOnly) queryParams.append('freeOnly', 'true')
    if (filter.paidOnly) queryParams.append('paidOnly', 'true')
    if (filter.searchQuery) queryParams.append('q', filter.searchQuery)
    if (filter.instructorId) queryParams.append('instructorId', filter.instructorId.toString())
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())
    return queryParams
  }

  // Helper function to update URL
  const updateUrl = (queryParams: URLSearchParams) => {
    const queryString = queryParams.toString()
    const newRoute = queryString ? `/courses?${queryString}` : '/courses'
    navigateTo(newRoute)
  }

  // Actions
  const fetchAllCourses = async (filter?: CoursesFilter, page: number = 1) => {
    loading.value = true
    error.value = null

    try {
      if (filter) currentFilter.value = filter

      const queryParams = buildQueryParams(currentFilter.value, page, itemsPerPage.value)
      const queryString = queryParams.toString()
      const url = `/api/courses?${queryString}`

      const response = await $fetch<CourseListResponse>(url)

      if (response.success) {
        courses.value = response.data || []

        if (response.pagination) {
          currentPage.value = response.pagination.currentPage
          totalPages.value = response.pagination.totalPages
          totalItems.value = response.pagination.totalItems
          itemsPerPage.value = response.pagination.itemsPerPage
        }
      } else {
        error.value = 'Failed to fetch courses'
      }
    } catch (err: unknown) {
      const apiResponse = err as { data?: { message?: string } }
      error.value =
        apiResponse.data?.message ||
        (err as Error)?.message ||
        'An error occurred while fetching courses'
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<CourseDetailResponse>(`/api/courses/${id}`)

      if (response.success) {
        detailedCourse.value = response.data
      } else {
        error.value = 'Failed to fetch course'
      }
    } catch (err: unknown) {
      const apiResponse = err as { data?: { message?: string } }
      error.value =
        apiResponse.data?.message ||
        (err as Error)?.message ||
        'An error occurred while fetching the course'
    } finally {
      loading.value = false
    }
  }

  const resetFilter = () => {
    currentFilter.value = {}
    currentPage.value = 1

    navigateTo('/courses')
    void fetchAllCourses({}, 1)
  }

  const applyFilter = (filter: CoursesFilter) => {
    currentFilter.value = filter
    currentPage.value = 1

    const queryParams = buildQueryParams(filter, 1, itemsPerPage.value)
    updateUrl(queryParams)
    void fetchAllCourses(filter, 1)
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page

      const queryParams = buildQueryParams(currentFilter.value, page, itemsPerPage.value)
      updateUrl(queryParams)
      void fetchAllCourses(undefined, page)
    }
  }

  return {
    // State
    courses,
    detailedCourse,
    loading,
    error,
    currentFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,

    // Actions
    fetchAllCourses,
    fetchCourseById,
    resetFilter,
    applyFilter,
    changePage
  }
})
