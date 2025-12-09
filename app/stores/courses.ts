import type { Course, DetailedCourse } from '~/types/shared/courses'
import type { CoursesFilter } from '~/types/courses-filter'
import { updateUrl } from '~/utils/course-helpers'

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
  const resetFilter = () => {
    currentFilter.value = {}
    currentPage.value = 1
    updateUrl({}, currentPage.value, itemsPerPage.value)
  }

  const applyFilter = (filter: CoursesFilter) => {
    // Merge the new filter with the current filter to preserve other filter values
    currentFilter.value = { ...currentFilter.value, ...filter }
    currentPage.value = 1

    updateUrl(currentFilter.value, currentPage.value, itemsPerPage.value)
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page

      updateUrl(currentFilter.value, page, itemsPerPage.value)
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
    resetFilter,
    applyFilter,
    changePage,
  }
})
