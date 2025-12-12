import {
  courses,
  lessons,
  courseLearningObjectives,
  courseContentSections,
  reviews,
} from './schema'
import { db } from './index'
import { eq, desc, asc, and, gte, lte, like, inArray, or } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import type { CreateCourseData, UpdateCourseData } from '~/types/shared/courses'

// Using the schema types
type CourseType = InferSelectModel<typeof courses>
type LessonType = InferSelectModel<typeof lessons>
type CourseLearningObjectiveType = InferSelectModel<typeof courseLearningObjectives>
type CourseContentSectionType = InferSelectModel<typeof courseContentSections>
type ReviewType = InferSelectModel<typeof reviews>

type Course = CourseType
type Lesson = LessonType
type CourseLearningObjective = CourseLearningObjectiveType
type CourseContentSection = CourseContentSectionType
type Review = ReviewType

export async function getAllCourses(
  filter: {
    category?: string
    categories?: string[]
    level?: string
    levels?: string[]
    tags?: string[]
    freeOnly?: boolean
    paidOnly?: boolean
    minPrice?: number
    maxPrice?: number
    searchQuery?: string
    instructorId?: number
  } = {},
  limit?: number,
  offset?: number,
): Promise<Course[]> {
  try {
    // Build where conditions array
    const whereConditions = []

    if (filter.category) {
      whereConditions.push(eq(courses.category, filter.category))
    }

    if (filter.categories && filter.categories.length > 0) {
      whereConditions.push(inArray(courses.category, filter.categories))
    }

    if (filter.level) {
      whereConditions.push(eq(courses.level, filter.level))
    }

    if (filter.levels && filter.levels.length > 0) {
      whereConditions.push(inArray(courses.level, filter.levels))
    }

    if (filter.tags && filter.tags.length > 0) {
      // Looking for courses that have any of the provided tags
      // We'll search for each tag in the comma-separated tags column
      const tagConditions = filter.tags.map(tag => like(courses.tags, `%${tag}%`))
      if (tagConditions.length > 0) {
        whereConditions.push(tagConditions.length === 1 ? tagConditions[0] : or(...tagConditions))
      }
    }

    if (filter.freeOnly) {
      whereConditions.push(eq(courses.price, 0))
    }

    if (filter.paidOnly) {
      whereConditions.push(gte(courses.price, 1))
    }

    if (filter.minPrice !== undefined) {
      whereConditions.push(gte(courses.price, filter.minPrice))
    }

    if (filter.maxPrice !== undefined) {
      whereConditions.push(lte(courses.price, filter.maxPrice))
    }

    if (filter.searchQuery) {
      whereConditions.push(like(courses.title, `%${filter.searchQuery}%`))
    }

    if (filter.instructorId !== undefined) {
      whereConditions.push(eq(courses.instructorId, filter.instructorId))
    }

    // Build the base query
    let query = db
      .select()
      .from(courses)

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        // @ts-expect-error - Suppressing Drizzle internal type error
        query = query.where(whereConditions[0])
      }
      else {
        // @ts-expect-error - Suppressing Drizzle internal type error
        query = query.where(and(...whereConditions))
      }
    }

    // @ts-expect-error - Suppressing Drizzle internal type error
    query = query.orderBy(desc(courses.createdAt))

    // Apply pagination if specified
    if (limit !== undefined) {
      // @ts-expect-error - Suppressing Drizzle internal type error
      query = query.limit(limit)
    }

    if (offset !== undefined) {
      // @ts-expect-error - Suppressing Drizzle internal type error
      query = query.offset(offset)
    }

    // Type assertion to fix Drizzle type errors
    const result: Course[] = await query as Course[]
    return result
  }
  catch (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }
}

// Function to count courses matching the filters
export async function getCoursesCount(
  filter: {
    category?: string
    categories?: string[]
    level?: string
    levels?: string[]
    tags?: string[]
    freeOnly?: boolean
    paidOnly?: boolean
    minPrice?: number
    maxPrice?: number
    searchQuery?: string
    instructorId?: number
  } = {},
): Promise<number> {
  try {
    // Build where conditions array
    const whereConditions = []

    if (filter.category) {
      whereConditions.push(eq(courses.category, filter.category))
    }

    if (filter.categories && filter.categories.length > 0) {
      whereConditions.push(inArray(courses.category, filter.categories))
    }

    if (filter.level) {
      whereConditions.push(eq(courses.level, filter.level))
    }

    if (filter.levels && filter.levels.length > 0) {
      whereConditions.push(inArray(courses.level, filter.levels))
    }

    if (filter.tags && filter.tags.length > 0) {
      // Looking for courses that have any of the provided tags
      // We'll search for each tag in the comma-separated tags column
      const tagConditions = filter.tags.map(tag => like(courses.tags, `%${tag}%`))
      if (tagConditions.length > 0) {
        whereConditions.push(tagConditions.length === 1 ? tagConditions[0] : or(...tagConditions))
      }
    }

    if (filter.freeOnly) {
      whereConditions.push(eq(courses.price, 0))
    }

    if (filter.paidOnly) {
      whereConditions.push(gte(courses.price, 1))
    }

    if (filter.minPrice !== undefined) {
      whereConditions.push(gte(courses.price, filter.minPrice))
    }

    if (filter.maxPrice !== undefined) {
      whereConditions.push(lte(courses.price, filter.maxPrice))
    }

    if (filter.searchQuery) {
      whereConditions.push(like(courses.title, `%${filter.searchQuery}%`))
    }

    if (filter.instructorId !== undefined) {
      whereConditions.push(eq(courses.instructorId, filter.instructorId))
    }

    // Build the base query - get all matching records and count them
    let query = db.select({ id: courses.id }).from(courses)

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        // @ts-expect-error - Suppressing Drizzle internal type error
        query = query.where(whereConditions[0])
      }
      else {
        // @ts-expect-error - Suppressing Drizzle internal type error
        query = query.where(and(...whereConditions))
      }
    }

    const result: { id: number }[] = await query as { id: number }[]
    return result.length
  }
  catch (error) {
    console.error('Error counting courses:', error)
    throw new Error('Failed to count courses')
  }
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  try {
    const result: Course[] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1)

    return result[0] ?? undefined
  }
  catch (error) {
    console.error(`Error fetching course with id ${id}:`, error)
    throw new Error('Failed to fetch course')
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    const result: Course[] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1)

    return result[0] ?? undefined
  }
  catch (error) {
    console.error(`Error fetching course with slug ${slug}:`, error)
    throw new Error('Failed to fetch course')
  }
}

// New function to get detailed course information including learning objectives, content sections and reviews
export async function getDetailedCourseById(id: number) {
  try {
    // Get the basic course info
    const course = await getCourseById(id)
    if (!course) {
      return undefined
    }

    // Get course learning objectives
    const learningObjectives: CourseLearningObjective[] = await db
      .select()
      .from(courseLearningObjectives)
      .where(eq(courseLearningObjectives.courseId, id))
      .orderBy(asc(courseLearningObjectives.orderVal))

    // Get course content sections
    const contentSections: CourseContentSection[] = await db
      .select()
      .from(courseContentSections)
      .where(eq(courseContentSections.courseId, id))
      .orderBy(asc(courseContentSections.orderVal))

    // Get course reviews
    const courseReviews: Review[] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.courseId, id))
      .orderBy(desc(reviews.createdAt))

    // Get course lessons
    const courseLessons: Lesson[] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, id))
      .orderBy(asc(lessons.orderVal))

    return {
      course,
      learningObjectives,
      contentSections,
      reviews: courseReviews,
      lessons: courseLessons,
    }
  }
  catch (error) {
    console.error(`Error fetching detailed course with id ${id}:`, error)
    throw new Error('Failed to fetch detailed course')
  }
}

export async function getDetailedCourseBySlug(slug: string) {
  console.log(`Fetching detailed course with slug: ${slug}`)

  // Get the basic course info
  const course = await getCourseBySlug(slug)
  if (!course) {
    console.log(`Course with slug ${slug} not found`)
    return undefined
  }

  console.log(`Found course: ${course.title} (ID: ${course.id})`)

  // Get course learning objectives
  console.log(`Fetching learning objectives for course ID: ${course.id}`)
  const learningObjectives: CourseLearningObjective[] = await db
    .select()
    .from(courseLearningObjectives)
    .where(eq(courseLearningObjectives.courseId, course.id))
    .orderBy(asc(courseLearningObjectives.orderVal))

  // Get course content sections
  console.log(`Fetching content sections for course ID: ${course.id}`)
  const contentSections: CourseContentSection[] = await db
    .select()
    .from(courseContentSections)
    .where(eq(courseContentSections.courseId, course.id))
    .orderBy(asc(courseContentSections.orderVal))

  // Get course reviews
  console.log(`Fetching reviews for course ID: ${course.id}`)
  const courseReviews: Review[] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.courseId, course.id))
    .orderBy(desc(reviews.createdAt))

  // Get course lessons
  console.log(`Fetching lessons for course ID: ${course.id}`)
  const courseLessons: Lesson[] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.orderVal))

  console.log(`Successfully fetched all details for course: ${course.title}`)

  return {
    course,
    learningObjectives,
    contentSections,
    reviews: courseReviews,
    lessons: courseLessons,
  }
}

export async function getCoursesByInstructorId(instructorId: number): Promise<Course[]> {
  try {
    const result: Course[] = await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt))

    return result
  }
  catch (error) {
    console.error(`Error fetching courses for instructor with id ${instructorId}:`, error)
    throw new Error('Failed to fetch courses for instructor')
  }
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  try {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const [newCourse] = await db
      .insert(courses)
      .values({
        ...data,
        slug,
        studentCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    if (!newCourse) {
      throw new Error('Failed to create course - no result returned')
    }

    return newCourse
  }
  catch (error) {
    console.error('Error creating course:', error)
    throw new Error('Failed to create course')
  }
}

export async function updateCourse(
  id: number,
  data: UpdateCourseData,
): Promise<Course | undefined> {
  try {
    // If title is being updated, regenerate the slug
    let slug: string | undefined
    if (data.title !== undefined) {
      slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const updateData: UpdateCourseData & { slug?: string, updatedAt: Date } = {
      ...data,
      updatedAt: new Date(),
    }

    // Only add slug to update if it was generated (i.e., title was changed)
    if (slug !== undefined) {
      updateData.slug = slug
    }

    const [updatedCourse] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning()

    return updatedCourse
  }
  catch (error) {
    console.error(`Error updating course with id ${id}:`, error)
    throw new Error('Failed to update course')
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await db.delete(courses).where(eq(courses.id, id))
  }
  catch (error) {
    console.error(`Error deleting course with id ${id}:`, error)
    throw new Error('Failed to delete course')
  }
}

export async function getCourseLessons(courseId: number): Promise<Lesson[]> {
  try {
    const result: Lesson[] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.orderVal))

    return result
  }
  catch (error) {
    console.error(`Error fetching lessons for course with id ${courseId}:`, error)
    throw new Error('Failed to fetch course lessons')
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const results: { category: string }[] = await db
      .select({ category: courses.category })
      .from(courses)
      .groupBy(courses.category)

    return results.map(result => result.category)
  }
  catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

export async function getAllLevels(): Promise<string[]> {
  try {
    const results: { level: string }[] = await db.select({ level: courses.level }).from(courses).groupBy(courses.level)

    return results.map(result => result.level)
  }
  catch (error) {
    console.error('Error fetching levels:', error)
    throw new Error('Failed to fetch levels')
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    // Get all courses with tags
    const coursesWithTags: { tags: string | null }[] = await db.select({ tags: courses.tags }).from(courses)

    // Extract and split tags
    const allTags = new Set<string>()
    for (const course of coursesWithTags) {
      if (course.tags && typeof course.tags === 'string') {
        // Split by comma and trim whitespace
        const tags = course.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== '')
        tags.forEach(tag => allTags.add(tag))
      }
    }

    return Array.from(allTags)
  }
  catch (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to fetch tags')
  }
}
