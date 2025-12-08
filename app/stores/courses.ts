import type { Course, DetailedCourse } from '~/types/shared/courses'
import type { CoursesFilter } from '~/types/courses-filter'
import type { CourseListResponse } from '~/types/shared/api'
import { buildQueryParams, updateUrl } from '~/utils/course-helpers'

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

  // Actions
  const fetchAllCourses = async (page: number = 1) => {
    loading.value = true
    error.value = null

    try {
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
      }
      else {
        error.value = 'Failed to fetch courses'
      }
    }
    catch (err: unknown) {
      const apiResponse = err as { data?: { message?: string } }
      error.value
        = apiResponse.data?.message
          || (err as Error)?.message

          || 'An error occurred while fetching courses'
    }
    finally {
      loading.value = false
    }
  }

  const resetFilter = () => {
    currentFilter.value = {}
    currentPage.value = 1

    updateUrl({}, currentPage.value, itemsPerPage.value)
    void fetchAllCourses(1)
  }

  const applyFilter = (filter: CoursesFilter) => {
    currentFilter.value = { ...filter }
    currentPage.value = 1

    updateUrl(filter, currentPage.value, itemsPerPage.value)
    void fetchAllCourses(1)
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page

      updateUrl(currentFilter.value, page, itemsPerPage.value)
      void fetchAllCourses(page)
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
    resetFilter,
    applyFilter,
    changePage,
  }
})
