import type { Course as CourseType, DetailedCourse, Review } from '~/types/shared/courses'
import { processCourseImage } from './image-processor'
import type { InstructorInfo } from './instructor-service'

export interface RawCourse {
  id: number
  title: string
  description: string | null
  categoryId: number | null
  category: string | null
  instructorId: number | null
  studentCount: number | null
  rating: number | null
  price: number
  level: string | null
  tags: string | null
  thumbnail: string | null
  slug: string
  createdAt: Date
  updatedAt: Date
  instructor?: InstructorInfo | null
}

export function transformCourseForClient(course: RawCourse): CourseType {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category || (course.categoryId ? String(course.categoryId) : 'Uncategorized'),
    instructorId: course.instructorId || 0,
    rating: course.rating || 0,
    price: course.price / 100,
    level: course.level || 'beginner',
    tags: course.tags || undefined,
    thumbnail: processCourseImage(course.thumbnail) ?? null,
    slug: course.slug,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    instructor: {
      name: course.instructor?.name || 'Unknown Instructor',
      avatar: course.instructor?.avatar || '/images/placeholder-avatar.svg',
    },
    stats: {
      students: course.studentCount || 0,
    },
  }
}

export function transformCoursesForClient(courses: RawCourse[]): CourseType[] {
  return courses.map(course => transformCourseForClient(course))
}

interface RawCourseLearningObjective {
  id: number
  courseId: number
  objective: string
  orderVal: number
  createdAt: Date
  updatedAt: Date
}

interface RawCourseContentSection {
  id: number
  courseId: number
  title: string
  description: string | null
  lessonsCount: number
  orderVal: number
  createdAt: Date
  updatedAt: Date
}

interface RawLesson {
  id: number
  courseId: number
  sectionId: number | null
  title: string
  slug: string
  content: string | null
  videoUrl: string
  duration?: string
  orderVal: number
  createdAt: Date
  updatedAt: Date
}

interface RawReview {
  id: number
  rating: number
  comment: string | null
  createdAt: Date
  user?: {
    id: number
    name: string | null
    avatar: string | null
  }
}

export function transformCourseForClientWithDetails(
  course: RawCourse,
  learningObjectives: RawCourseLearningObjective[] = [],
  contentSections: RawCourseContentSection[] = [],
  reviews: RawReview[] = [],
  lessons: RawLesson[] = [],
): DetailedCourse {
  const basicCourse = transformCourseForClient(course)

  const orderedLearningObjectives = learningObjectives
    .sort((a, b) => a.orderVal - b.orderVal)
    .map(obj => obj.objective)

  const orderedContentSections = contentSections
    .sort((a, b) => a.orderVal - b.orderVal)
    .map((section) => {
      const sectionLessons = lessons.length > 0
        ? lessons
            .filter(lesson => lesson.sectionId === section.id)
            .sort((a, b) => a.orderVal - b.orderVal)
            .map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              slug: lesson.slug || lesson.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, ''),
              duration: lesson.duration || `${Math.floor(Math.random() * 10) + 1} min`,
              videoUrl: lesson.videoUrl,
            }))
        : []

      return {
        id: section.id,
        title: section.title,
        description: section.description || undefined,
        lessons: section.lessonsCount,
        content: sectionLessons,
      }
    })

  const transformedReviews: Review[] = reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    user: review.user,
  }))

  return {
    ...basicCourse,
    lessons: lessons.length > 0 ? lessons.map(lesson => lesson.title) : [],
    learningObjectives: orderedLearningObjectives,
    courseContent: orderedContentSections,
    reviews: transformedReviews,
  }
}
