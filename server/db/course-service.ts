import { courses, lessons } from './schema'
import { db } from './index'
import { eq, desc, asc } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import type { CreateCourseData, UpdateCourseData } from '../../app/types/shared/courses'

// Using the schema types
type CourseType = InferSelectModel<typeof courses>
type LessonType = InferSelectModel<typeof lessons>

type Course = CourseType
type Lesson = LessonType

import type { CreateCourseData, UpdateCourseData } from '../../../app/types/shared/courses'

export async function getAllCourses(): Promise<Course[]> {
  try {
    // Join courses with users to get instructor information
    const result = await db
      .select({
        // Course fields
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        studentCount: courses.studentCount,
        rating: courses.rating,
        price: courses.price,
        duration: courses.duration,
        level: courses.level,
        image: courses.image,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .orderBy(desc(courses.createdAt))
      
    return result
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  try {
    const result = await db
      .select({
        // Course fields
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        studentCount: courses.studentCount,
        rating: courses.rating,
        price: courses.price,
        duration: courses.duration,
        level: courses.level,
        image: courses.image,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1)
    
    return result[0]
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error)
    throw new Error('Failed to fetch course')
  }
}

export async function getCoursesByInstructorId(instructorId: number): Promise<Course[]> {
  try {
    const result = await db
      .select({
        // Course fields
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        studentCount: courses.studentCount,
        rating: courses.rating,
        price: courses.price,
        duration: courses.duration,
        level: courses.level,
        image: courses.image,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt))
      
    return result
  } catch (error) {
    console.error(`Error fetching courses for instructor with id ${instructorId}:`, error)
    throw new Error('Failed to fetch courses for instructor')
  }
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  try {
    const [newCourse] = await db
      .insert(courses)
      .values({
        ...data,
        studentCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    
    return newCourse
  } catch (error) {
    console.error('Error creating course:', error)
    throw new Error('Failed to create course')
  }
}

export async function updateCourse(id: number, data: UpdateCourseData): Promise<Course | undefined> {
  try {
    const [updatedCourse] = await db
      .update(courses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning()
    
    return updatedCourse
  } catch (error) {
    console.error(`Error updating course with id ${id}:`, error)
    throw new Error('Failed to update course')
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await db.delete(courses).where(eq(courses.id, id))
  } catch (error) {
    console.error(`Error deleting course with id ${id}:`, error)
    throw new Error('Failed to delete course')
  }
}

export async function getCourseLessons(courseId: number): Promise<Lesson[]> {
  try {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.order))
  } catch (error) {
    console.error(`Error fetching lessons for course with id ${courseId}:`, error)
    throw new Error('Failed to fetch course lessons')
  }
}