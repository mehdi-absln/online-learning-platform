import { eq, desc, asc, and, gte, lte, like, inArray, or } from 'drizzle-orm'
import { db } from './index'
import {
  courses,
  courseContentSections,
  lessons,
  courseLearningObjectives,
  instructors,
  categories,
  type Course as DbCourse,
} from './schema'
import type { CreateCourseData, UpdateCourseData } from '~/types/course'
import { enrichCoursesWithInstructors } from '../utils/instructor-service'
import { getCourseReviews as getCourseReviewsFromService } from './review-service'

// =====================
// Types
// =====================
export interface CourseFilter {
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
}

// =====================
// Helper: Build filter conditions
// =====================

function generateLessonSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildCourseWhereConditions(filter: CourseFilter = {}) {
  const whereConditions = []

  if (filter.category) {
    const categoryId = parseInt(filter.category)
    if (!isNaN(categoryId)) {
      whereConditions.push(eq(courses.categoryId, categoryId))
    }
  }

  if (filter.categories && filter.categories.length > 0) {
    const categoryIds = filter.categories
      .map(c => parseInt(c))
      .filter(id => !isNaN(id))
    if (categoryIds.length > 0) {
      whereConditions.push(inArray(courses.categoryId, categoryIds))
    }
  }

  if (filter.level) {
    whereConditions.push(eq(courses.level, filter.level))
  }

  if (filter.levels && filter.levels.length > 0) {
    whereConditions.push(inArray(courses.level, filter.levels))
  }

  if (filter.tags && filter.tags.length > 0) {
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

  return whereConditions.length > 0 ? and(...whereConditions) : undefined
}

// =====================
// Get all courses with filters
// =====================
export async function getAllCourses(
  filter: CourseFilter = {},
  limit?: number,
  offset?: number,
) {
  try {
    const where = buildCourseWhereConditions(filter)

    let query = db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        categoryId: courses.categoryId,
        category: categories.name,
        instructorId: courses.instructorId,
        studentCount: courses.studentsCount,
        rating: courses.rating,
        price: courses.price,
        level: courses.level,
        tags: courses.tags,
        thumbnail: courses.thumbnail,
        slug: courses.slug,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .$dynamic()

    if (where) {
      query = query.where(where)
    }

    query = query.orderBy(desc(courses.createdAt))

    if (limit !== undefined) {
      query = query.limit(limit)
    }

    if (offset !== undefined) {
      query = query.offset(offset)
    }

    const result = await query

    const enrichedCourses = await enrichCoursesWithInstructors(result)

    return enrichedCourses
  }
  catch {
    throw new Error('Failed to fetch courses')
  }
}

// Function to count courses matching the filters
export async function getCoursesCount(
  filter: CourseFilter = {},
): Promise<number> {
  try {
    const where = buildCourseWhereConditions(filter)

    let query = db.select({ id: courses.id }).from(courses).$dynamic()

    if (where) {
      query = query.where(where)
    }

    const result = await query
    return result.length
  }
  catch {
    throw new Error('Failed to count courses')
  }
}

export async function getCourseById(id: number) {
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1)

  return result[0] ?? undefined
}

// =====================
// Get course by slug
// =====================
export async function getCourseBySlug(slug: string) {
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1)

  if (result[0]) {
    const course = result[0]

    // Get category name
    let categoryName: string | null = null
    if (course.categoryId) {
      const categoryResult = await db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, course.categoryId))
        .limit(1)

      categoryName = categoryResult[0]?.name || null
    }

    return {
      ...course,
      category: categoryName,
      categoryId: course.categoryId,
    }
  }
  return null
}

// =====================
// Get course sections
// =====================
export async function getCourseSections(courseId: number) {
  return await db
    .select()
    .from(courseContentSections)
    .where(eq(courseContentSections.courseId, courseId))
    .orderBy(asc(courseContentSections.orderVal))
}

// =====================
// Get all lessons for a course
// =====================
export async function getCourseLessons(courseId: number) {
  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.orderVal))
}

// =====================
// Get learning objectives
// =====================
export async function getCourseLearningObjectives(courseId: number) {
  const result = await db
    .select()
    .from(courseLearningObjectives)
    .where(eq(courseLearningObjectives.courseId, courseId))
    .orderBy(asc(courseLearningObjectives.orderVal))

  return result.map(obj => obj.objective)
}

// =====================
// Get reviews with user info
// =====================
// Uses getCourseReviews from review-service.ts for enhanced functionality

// =====================
// Get instructor
// =====================
export async function getInstructor(instructorId: number) {
  const result = await db
    .select()
    .from(instructors)
    .where(eq(instructors.id, instructorId))
    .limit(1)

  return result[0] || null
}

// =====================
// Get detailed course by slug (MAIN FUNCTION)
// =====================
export async function getDetailedCourseBySlug(slug: string) {
  // 1. Get course
  const courseResult = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1)

  if (!courseResult[0]) {
    return null
  }

  const course = courseResult[0]

  // 2. Get category name
  let categoryName: string | null = null
  if (course.categoryId) {
    const categoryResult = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, course.categoryId))
      .limit(1)

    categoryName = categoryResult[0]?.name || null
  }

  // 3. Get sections
  const sections = await getCourseSections(course.id)

  // 4. Get all lessons
  const allLessons = await getCourseLessons(course.id)

  // 5. Get learning objectives
  const learningObjectives = await getCourseLearningObjectives(course.id)

  // 6. Get reviews
  const courseReviews = await getCourseReviewsFromService(course.id)

  // 7. Get instructor
  const instructor = course.instructorId
    ? await getInstructor(course.instructorId)
    : null

  // 8. Build courseContent structure
  const courseContent = sections.map((section) => {
    const sectionLessons = allLessons
      .filter(lesson => lesson.sectionId === section.id)
      .sort((a, b) => a.orderVal - b.orderVal)
      .map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug?.trim().toLowerCase() || generateLessonSlug(lesson.title),
        duration: lesson.duration || '00:00',
        isFree: lesson.isFree || false,
        videoUrl: lesson.videoUrl,
        description: lesson.description,
      }))

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      lessonsCount: sectionLessons.length,
      content: sectionLessons,
    }
  })

  // 9. Handle orphan lessons (lessons without section)
  const orphanLessons = allLessons.filter(lesson => !lesson.sectionId)
  if (orphanLessons.length > 0) {
    if (sections.length === 0) {
      courseContent.push({
        id: 0,
        title: 'Course Lessons',
        description: null,
        lessonsCount: orphanLessons.length,
        content: orphanLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug?.trim().toLowerCase() || generateLessonSlug(lesson.title),
          duration: lesson.duration || '00:00',
          isFree: lesson.isFree || false,
          videoUrl: lesson.videoUrl,
          description: lesson.description,
        })),
      })
    }
  }

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    price: course.price,
    originalPrice: course.originalPrice,
    thumbnail: course.thumbnail,
    level: course.level,
    language: course.language,
    duration: course.duration,
    lessonsCount: course.lessonsCount,
    studentsCount: course.studentsCount,
    rating: course.rating,
    reviewsCount: course.reviewsCount,
    isFeatured: course.isFeatured,
    isPublished: course.isPublished,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    tags: course.tags,
    categoryId: course.categoryId,
    categoryName,
    instructor: instructor
      ? {
          id: instructor.id,
          userId: instructor.userId,
          name: instructor.name,
          title: instructor.title,
          avatar: instructor.avatar,
          bio: instructor.bio,
        }
      : null,
    learningObjectives,
    courseContent,
    reviews: courseReviews || [],
  }
}

export async function getCoursesByInstructorId(instructorId: number): Promise<DbCourse[]> {
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.instructorId, instructorId))
    .orderBy(desc(courses.createdAt))

  return result
}

export async function createCourse(data: CreateCourseData) {
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
      studentsCount: 0,
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

export async function updateCourse(
  id: number,
  data: UpdateCourseData,
) {
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

export async function deleteCourse(id: number) {
  await db.delete(courses).where(eq(courses.id, id))
}

export async function getAllCategories(): Promise<{ id: number, name: string }[]> {
  try {
    // First try to get from categories table
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)

    return result
  }
  catch {
    // If categories table doesn't exist, return empty
    return []
  }
}

export async function getAllLevels(): Promise<string[]> {
  const results = await db
    .select({ level: courses.level })
    .from(courses)
    .groupBy(courses.level)

  return results
    .map(result => result.level)
    .filter((l): l is string => l !== null)
}

export async function getAllTags(): Promise<string[]> {
  // Get all courses with tags
  const coursesWithTags = await db.select({ tags: courses.tags }).from(courses)

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
