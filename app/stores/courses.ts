import type { Course } from '~/types/shared/auth'
import type { DetailedCourse, Lesson } from '~/types/shared/courses'
import type { CoursesFilter, PaginatedCoursesResponse } from '~/types/courses-filter'

export const useCoursesStore = defineStore('courses', () => {
  // State
  const courses = ref<Course[]>([])
  const detailedCourse = ref<DetailedCourse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentFilter = ref<CoursesFilter>({})
  const currentPage = ref(1)
  const itemsPerPage = ref(12) // Updated to match API default
  const totalPages = ref(1)
  const totalItems = ref(0)

  // Actions
  const fetchAllCourses = async (filter?: CoursesFilter, page: number = 1) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching courses from API with filters:', filter, 'page:', page)
      
      // If filter is provided, update the current filter
      if (filter !== undefined) {
        currentFilter.value = filter
      }
      
      // Build query string from filter and pagination
      const queryParams = new URLSearchParams()
      if (currentFilter.value.category) {
        queryParams.append('category', currentFilter.value.category)
      }
      if (currentFilter.value.categories && currentFilter.value.categories.length > 0) {
        currentFilter.value.categories.forEach(category => {
          queryParams.append('categories', category)
        })
      }
      if (currentFilter.value.level) {
        queryParams.append('level', currentFilter.value.level)
      }
      if (currentFilter.value.levels && currentFilter.value.levels.length > 0) {
        currentFilter.value.levels.forEach(level => {
          queryParams.append('levels', level)
        })
      }
      if (currentFilter.value.tags && currentFilter.value.tags.length > 0) {
        currentFilter.value.tags.forEach(tag => {
          queryParams.append('tags', tag)
        })
      }
      if (currentFilter.value.freeOnly) {
        queryParams.append('freeOnly', 'true')
      }
      if (currentFilter.value.paidOnly) {
        queryParams.append('paidOnly', 'true')
      }
      if (currentFilter.value.searchQuery) {
        queryParams.append('q', currentFilter.value.searchQuery)
      }
      if (currentFilter.value.instructorId) {
        queryParams.append('instructorId', currentFilter.value.instructorId.toString())
      }
      queryParams.append('page', page.toString())
      queryParams.append('limit', itemsPerPage.value.toString())
      
      const queryString = queryParams.toString()
      const url = `/api/courses?${queryString}`
      
      const response: any = await $fetch(url)
      console.log('API response:', response)
      
      if (response.success) {
        console.log('Number of courses received:', response.data?.length || 0)
        // The API now returns properly structured data
        courses.value = response.data || []
        console.log('Courses stored in store:', courses.value.length)
        
        // Update pagination info if available
        if (response.pagination) {
          currentPage.value = response.pagination.currentPage
          totalPages.value = response.pagination.totalPages
          totalItems.value = response.pagination.totalItems
          itemsPerPage.value = response.pagination.itemsPerPage
        }
      } else {
        console.error('API response not successful:', response.message)
        throw new Error(response.message || 'Failed to fetch courses')
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching courses'
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch(`/api/courses/${id}`)
      
      if (response.success) {
        // The API now returns properly structured data
        detailedCourse.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch course')
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching the course'
      console.error(`Error fetching course with id ${id}:`, err)
    } finally {
      loading.value = false
    }
  }

  const resetFilter = () => {
    currentFilter.value = {}
    currentPage.value = 1
  }

  const applyFilter = (filter: CoursesFilter) => {
    currentFilter.value = filter
    currentPage.value = 1
    fetchAllCourses(filter, 1)
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchAllCourses(undefined, page)
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
    changePage,
  }
})