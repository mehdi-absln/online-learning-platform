import type { Course as CourseType, DetailedCourse, CourseContentSection, Review } from '~/types/shared/courses'
import { processInstructorAvatar, processCourseImage } from './image-processor'

// Define type for raw course data from database
interface RawCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  instructorId: number;
  studentCount: number;
  rating: number;
  price: number;
  duration: string;
  level: string;
  tags?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  instructor?: {
    name: string;
    avatar?: string;
  };
}

// Define type for raw course learning objectives from database
interface RawCourseLearningObjective {
  id: number;
  courseId: number;
  objective: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define type for raw course content sections from database
interface RawCourseContentSection {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  lessonsCount: number;
  duration: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define type for raw reviews from database
interface RawReview {
  id: number;
  courseId: number;
  reviewerName: string;
  reviewerId?: number;
  rating: number;
  comment?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define type for raw lessons from database
interface RawLesson {
  id: number;
  courseId: number;
  sectionId?: number;
  title: string;
  content?: string;
  videoUrl?: string; // Optional YouTube video URL
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export function transformCourseForClient(course: RawCourse): CourseType {
  // Convert price from cents to dollars and add instructor information
  return {
    ...course,
    price: course.price / 100, // Convert from cents to dollars
    image: processCourseImage(course.image),
    instructor: {
      name: course.instructor?.name || 'Instructor Name',
      avatar: processInstructorAvatar(course.instructor?.avatar, course.instructor?.name || 'Instructor Name')
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
    ? learningObjectives
        .sort((a, b) => a.order - b.order)
        .map(obj => obj.objective)
    : []

  // Transform content sections and group lessons by section
  const orderedContentSections = contentSections
    ? contentSections
        .sort((a, b) => a.order - b.order)
        .map(section => {
          // Get lessons for this specific section
          const sectionLessons = lessons && lessons.length > 0
            ? lessons
                .filter(lesson => lesson.sectionId === section.id)
                .sort((a, b) => a.order - b.order)
                .map(lesson => ({
                  id: lesson.id, // Include the lesson ID
                  title: lesson.title,
                  duration: lesson.duration || `${Math.floor(Math.random() * 10) + 1} min`, // Generate a random duration if not available
                  videoUrl: lesson.videoUrl // Use existing videoUrl
                }))
            : []

          return {
            id: section.id,
            title: section.title,
            description: section.description || '',
            lessons: section.lessonsCount,
            duration: section.duration,
            content: sectionLessons // Add lessons array to the section
          }
        })
    : []

  // Transform reviews
  const transformedReviews = reviews && reviews.length > 0
    ? reviews.map(review => ({
        reviewerName: review.reviewerName,
        rating: review.rating,
        comment: review.comment || '',
        date: review.date ? review.date.toISOString() : new Date().toISOString()
      } as Review))
    : []

  return {
    ...basicCourse,
    lessons: lessons && lessons.length > 0 ? lessons.map(lesson => lesson.title) : [], // Just the lesson titles for the main course
    learningObjectives: orderedLearningObjectives,
    courseContent: orderedContentSections,
    reviews: transformedReviews
  }
}

export function transformCoursesForClient(courses: RawCourse[]): CourseType[] {
  return courses.map(course => transformCourseForClient(course))
}