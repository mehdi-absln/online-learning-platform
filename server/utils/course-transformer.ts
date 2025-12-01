import type {
  Course as CourseType,
  DetailedCourse,
  CourseContentSection,
  Review
} from '~/types/shared/courses'
import { processInstructorAvatar, processCourseImage } from './image-processor'

// Define type for raw course data from database
interface RawCourse {
  id: number
  title: string
  description: string
  category: string
  instructorId: number
  studentCount: number
  rating: number
  price: number
  level: string
  tags?: string
  image?: string
  slug: string
  createdAt: Date
  updatedAt: Date
  instructor?: {
    name: string
    avatar?: string
  }
}

// Define type for raw course learning objectives from database
interface RawCourseLearningObjective {
  id: number
  courseId: number
  objective: string
  order: number
  createdAt: Date
  updatedAt: Date
}

// Define type for raw course content sections from database
interface RawCourseContentSection {
  id: number
  courseId: number
  title: string
  description?: string
  lessonsCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

// Define type for raw reviews from database
interface RawReview {
  id: number
  courseId: number
  reviewerName: string
  reviewerId?: number
  rating: number
  comment?: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Define type for raw lessons from database
interface RawLesson {
  id: number
  courseId: number
  sectionId?: number
  title: string
  slug: string // URL-friendly slug for the lesson
  content?: string
  videoUrl?: string // Optional YouTube video URL
  duration?: string // Duration of the lesson
  order: number
  createdAt: Date
  updatedAt: Date
}

export function transformCourseForClient(course: RawCourse): CourseType {
  // Convert price from cents to dollars and add instructor information
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    instructorId: course.instructorId,
    studentCount: course.studentCount,
    rating: course.rating,
    price: course.price / 100, // Convert from cents to dollars
    level: course.level,
    tags: course.tags,
    image: processCourseImage(course.image),
    slug: course.slug, // Include the slug field
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    instructor: {
      name: course.instructor?.name || 'Instructor Name',
      avatar: processInstructorAvatar(
        course.instructor?.avatar,
        course.instructor?.name || 'Instructor Name'
      )
    },
    stats: {
      students: course.studentCount
    }
  }
}

export function transformCourseForClientWithDetails(
  course: RawCourse,
  learningObjectives: RawCourseLearningObjective[] = [],
  contentSections: RawCourseContentSection[] = [],
  reviews: RawReview[] = [],
  lessons: RawLesson[] = []
): DetailedCourse {
  // Transform the basic course info
  const basicCourse = transformCourseForClient(course)

  // Transform learning objectives to an array of strings in order
  const orderedLearningObjectives = learningObjectives
    ? learningObjectives.sort((a, b) => a.order - b.order).map((obj) => obj.objective)
    : []

  // Transform content sections and group lessons by section
  const orderedContentSections = contentSections
    ? contentSections
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          // Get lessons for this specific section
          const sectionLessons =
            lessons && lessons.length > 0
              ? lessons
                  .filter((lesson) => lesson.sectionId === section.id)
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => ({
                    id: lesson.id, // Include the lesson ID
                    title: lesson.title,
                    slug: lesson.slug || lesson.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, ''), // Generate slug from title if not available
                    duration: lesson.duration || `${Math.floor(Math.random() * 10) + 1} min`, // Generate a random duration if not available
                    videoUrl: lesson.videoUrl // Use existing videoUrl
                  }))
              : []

          return {
            id: section.id,
            title: section.title,
            description: section.description || '',
            lessons: section.lessonsCount,
            content: sectionLessons // Add lessons array to the section
          }
        })
    : []

  // Transform reviews
  const transformedReviews =
    reviews && reviews.length > 0
      ? reviews.map(
          (review) =>
            ({
              reviewerName: review.reviewerName,
              rating: review.rating,
              comment: review.comment || '',
              date: review.date ? review.date.toISOString() : new Date().toISOString()
            }) as Review
        )
      : []

  return {
    ...basicCourse,
    lessons: lessons && lessons.length > 0 ? lessons.map((lesson) => lesson.title) : [], // Just the lesson titles for the main course
    learningObjectives: orderedLearningObjectives,
    courseContent: orderedContentSections,
    reviews: transformedReviews
  }
}

export function transformCoursesForClient(courses: RawCourse[]): CourseType[] {
  return courses.map((course) => transformCourseForClient(course))
}
