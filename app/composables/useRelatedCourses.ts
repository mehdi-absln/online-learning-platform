import type { Course, CourseApiResponse } from '~/types/shared/courses'
import { processInstructorAvatar } from '~~/server/utils/image-processor'

interface RelatedCoursesResponse {
  success: boolean
  data: CourseApiResponse[]
  meta: {
    total: number
    basedOn: {
      categoryId: string | null
      tagIds: string[]
    }
  }
}

interface UseRelatedCoursesOptions {
  immediate?: boolean
}

// تابع تبدیل از CourseApiResponse به Course
const mapApiResponseToCourse = (apiCourse: CourseApiResponse): Course => {
  return {
    id: parseInt(apiCourse.id),
    title: apiCourse.title,
    description: apiCourse.description || '',
    category: apiCourse.category?.name || '',
    instructor: {
      name: apiCourse.instructor?.name || 'Unknown Instructor',
      avatar: processInstructorAvatar(
        apiCourse.instructor?.avatar || null,
        apiCourse.instructor?.name || 'Unknown Instructor'
      )
    },
    stats: {
      students: apiCourse.studentsCount || 0
    },
    rating: apiCourse.rating || 0,
    price: apiCourse.price, // Price should already be in dollars from API
    level: apiCourse.level || 'Beginner',
    tags: apiCourse.tags?.map(tag => tag.name).join(', '),
    image: apiCourse.image || '/images/placeholder-course.svg',
    slug: apiCourse.slug,
    createdAt: new Date(apiCourse.createdAt || new Date()),
    updatedAt: new Date(apiCourse.updatedAt || new Date()),
    instructorId: parseInt(apiCourse.instructorId || '0')
  }
}

export const useRelatedCourses = (
  courseId: MaybeRef<string | null | undefined>,
  options: UseRelatedCoursesOptions = {}
) => {
  const { immediate = true } = options

  const resolvedCourseId = computed(() => toValue(courseId))

  const {
    data,
    pending: loading,
    error,
    refresh,
    status
  } = useFetch<RelatedCoursesResponse>(
    () => `/api/courses/${resolvedCourseId.value}/related`,
    {
      key: () => `related-courses-${resolvedCourseId.value}`,
      immediate: immediate && !!resolvedCourseId.value,
      watch: [resolvedCourseId],
      default: () => ({
        success: false,
        data: [],
        meta: { total: 0, basedOn: { categoryId: null, tagIds: [] } }
      })
    }
  )

  // استخراج دوره‌های مرتبط از response و تبدیل آن‌ها به نوع Course
  const relatedCourses = computed(() =>
    data.value?.data.map(course => mapApiResponseToCourse(course)) || []
  )

  // تعداد دوره‌های مرتبط
  const totalRelated = computed(() => data.value?.meta?.total || 0)

  // آیا دوره‌های مرتبط وجود دارد؟
  const hasRelatedCourses = computed(() => relatedCourses.value.length > 0)

  // وضعیت خطا
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value?.message || null)

  return {
    // Data
    relatedCourses,
    totalRelated,
    hasRelatedCourses,

    // State
    loading,
    status,

    // Error
    error,
    hasError,
    errorMessage,

    // Actions
    refresh
  }
}