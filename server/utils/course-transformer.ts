import type { Course as CourseType } from '~/types/shared/courses'
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

export function transformCoursesForClient(courses: RawCourse[]): CourseType[] {
  return courses.map(course => transformCourseForClient(course))
}