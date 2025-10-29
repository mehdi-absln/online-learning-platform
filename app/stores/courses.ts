import type { Course } from '~/types/shared/auth'
import type { DetailedCourse, Lesson } from '~/types/shared/courses'

export const useCoursesStore = defineStore('courses', () => {
  // State
  const courses = ref<Course[]>([])
  const detailedCourse = ref<DetailedCourse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchAllCourses = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching courses from API...')
      const response = await $fetch('/api/courses')
      console.log('API response:', response)
      
      if (response.success) {
        console.log('Number of courses received:', response.data?.length || 0)
        // The API now returns properly structured data
        courses.value = response.data || []
        console.log('Courses stored in store:', courses.value.length)
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

  return {
    // State
    courses,
    detailedCourse,
    loading,
    error,
    
    // Actions
    fetchAllCourses,
    fetchCourseById,
  }
})