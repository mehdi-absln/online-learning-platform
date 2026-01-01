// server/utils/course-transformer.ts

import type { Course as CourseType, DetailedCourse, Review } from '~/types/shared/courses'
import { processCourseImage } from './image-processor'
import type { InstructorInfo } from './instructor-service'

/**
 * Raw course data from database (with instructor already enriched)
 */
export interface RawCourse {
  id: number
  title: string
  description: string
  categoryId: number | null
  category: string | null
  instructorId: number | null
  studentCount: number | null
  rating: number | null
  price: number
  level: string
  tags: string | null
  thumbnail?: string | null  // ✅ از DB مستقیم
  image?: string | null      // ✅ از course-service
  slug: string
  createdAt: Date
  updatedAt: Date
  instructor?: InstructorInfo | null
}

/**
 * Transform a single course to client format
 * This is the SINGLE source of truth for course transformation
 */
export function transformCourseForClient(course: RawCourse): CourseType {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category || (course.categoryId ? String(course.categoryId) : null),
    instructorId: course.instructorId || 0,
    rating: course.rating || 0,
    price: course.price / 100, // Convert from cents to dollars
    level: course.level,
    tags: course.tags || undefined,
    image: processCourseImage(course.thumbnail ?? course.image) ?? undefined,
    slug: course.slug,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    instructor: course.instructor || {
      id: 0,
      name: 'Unknown Instructor',
      avatar: '/images/placeholder-avatar.svg',
    },
    stats: {
      students: course.studentCount || 0,
    },
  }
}

/**
 * Transform multiple courses to client format
 */
export function transformCoursesForClient(courses: RawCourse[]): CourseType[] {
  return courses.map(course => transformCourseForClient(course))
}

// Define type for raw course learning objectives from database
interface RawCourseLearningObjective {
  id: number
  courseId: number
  objective: string
  orderVal: number
  createdAt: Date
  updatedAt: Date
}

// Define type for raw course content sections from database
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

// Define type for raw reviews from database
interface RawReview {
  id: number
  courseId: number
  reviewerName: string
  reviewerId: number | null
  rating: number
  comment: string | null
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Define type for raw lessons from database
interface RawLesson {
  id: number
  courseId: number
  sectionId: number | null
  title: string
  slug: string // URL-friendly slug for the lesson
  content: string | null
  videoUrl: string // Required YouTube video URL (as per schema)
  duration?: string // Duration of the lesson
  orderVal: number
  createdAt: Date
  updatedAt: Date
}

export function transformCourseForClientWithDetails(
  course: RawCourse,
  learningObjectives: RawCourseLearningObjective[] = [],
  contentSections: RawCourseContentSection[] = [],
  reviews: RawReview[] = [],
  lessons: RawLesson[] = [],
): DetailedCourse {
  // Transform the basic course info
  const basicCourse = transformCourseForClient(course)

  // Transform learning objectives to an array of strings in order
  const orderedLearningObjectives = learningObjectives
    ? learningObjectives.sort((a, b) => a.orderVal - b.orderVal).map(obj => obj.objective)
    : []

  // Transform content sections and group lessons by section
  const orderedContentSections = contentSections
    ? contentSections
        .sort((a, b) => a.orderVal - b.orderVal)
        .map((section) => {
          // Get lessons for this specific section
          const sectionLessons
            = lessons && lessons.length > 0
              ? lessons
                  .filter(lesson => lesson.sectionId === section.id)
                  .sort((a, b) => a.orderVal - b.orderVal)
                  .map(lesson => ({
                    id: lesson.id, // Include the lesson ID
                    title: lesson.title,
                    slug: lesson.slug || lesson.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, ''), // Generate slug from title if not available
                    duration: lesson.duration || `${Math.floor(Math.random() * 10) + 1} min`, // Generate a random duration if not available
                    videoUrl: lesson.videoUrl, // Use existing videoUrl
                  }))
              : []

          return {
            id: section.id,
            title: section.title,
            description: section.description || undefined,
            lessons: section.lessonsCount,
            content: sectionLessons, // Add lessons array to the section
          }
        })
    : []

  // Transform reviews
  const transformedReviews
    = reviews && reviews.length > 0
      ? reviews.map(
          review =>
            ({
              reviewerName: review.reviewerName,
              rating: review.rating,
              comment: review.comment || '',
              date: review.date ? review.date.toISOString() : new Date().toISOString(),
            }) as Review,
        )
      : []

  return {
    ...basicCourse,
    lessons: lessons && lessons.length > 0 ? lessons.map(lesson => lesson.title) : [], // Just the lesson titles for the main course
    learningObjectives: orderedLearningObjectives,
    courseContent: orderedContentSections,
    reviews: transformedReviews,
  }
}
