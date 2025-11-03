import { courses, lessons } from './schema'
import { db } from './index'
import { eq, desc, asc, and, gte, lte, like } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import type { CreateCourseData, UpdateCourseData } from '../../app/types/shared/courses'

// Using the schema types
type CourseType = InferSelectModel<typeof courses>
type LessonType = InferSelectModel<typeof lessons>

type Course = CourseType
type Lesson = LessonType

import type { CreateCourseData, UpdateCourseData } from '../../../app/types/shared/courses'

export async function getAllCourses(
  filter: {
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    instructorId?: number;
  } = {},
  limit?: number,
  offset?: number
): Promise<Course[]> {
  try {
    // Build where conditions array
    const whereConditions = []
    
    if (filter.category) {
      whereConditions.push(eq(courses.category, filter.category))
    }

    if (filter.level) {
      whereConditions.push(eq(courses.level, filter.level))
    }

    if (filter.minPrice !== undefined) {
      whereConditions.push(gte(courses.price, filter.minPrice))
    }

    if (filter.maxPrice !== undefined) {
      whereConditions.push(lte(courses.price, filter.maxPrice))
    }

    if (filter.searchQuery) {
      whereConditions.push(
        like(courses.title, `%${filter.searchQuery}%`)
      )
    }

    if (filter.instructorId !== undefined) {
      whereConditions.push(eq(courses.instructorId, filter.instructorId))
    }

    // Build the base query
    let query = db
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

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        query = query.where(whereConditions[0])
      } else {
        query = query.where(and(...whereConditions))
      }
    }

    query = query.orderBy(desc(courses.createdAt))
    
    // Apply pagination if specified
    if (limit !== undefined) {
      query = query.limit(limit)
    }
    
    if (offset !== undefined) {
      query = query.offset(offset)
    }
      
    const result = await query
    return result
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }
}

// Function to count courses matching the filters
export async function getCoursesCount(
  filter: {
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    instructorId?: number;
  } = {}
): Promise<number> {
  try {
    // Build where conditions array
    const whereConditions = []
    
    if (filter.category) {
      whereConditions.push(eq(courses.category, filter.category))
    }

    if (filter.level) {
      whereConditions.push(eq(courses.level, filter.level))
    }

    if (filter.minPrice !== undefined) {
      whereConditions.push(gte(courses.price, filter.minPrice))
    }

    if (filter.maxPrice !== undefined) {
      whereConditions.push(lte(courses.price, filter.maxPrice))
    }

    if (filter.searchQuery) {
      whereConditions.push(
        like(courses.title, `%${filter.searchQuery}%`)
      )
    }

    if (filter.instructorId !== undefined) {
      whereConditions.push(eq(courses.instructorId, filter.instructorId))
    }

    // Build the base query - get all matching records and count them
    let query = db.select({ id: courses.id }).from(courses)

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        query = query.where(whereConditions[0])
      } else {
        query = query.where(and(...whereConditions))
      }
    }
    
    const result = await query
    return result.length
  } catch (error) {
    console.error('Error counting courses:', error)
    throw new Error('Failed to count courses')
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