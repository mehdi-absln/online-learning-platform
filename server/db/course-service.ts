import { eq, desc, asc, and, gte, lte, like, inArray, or } from 'drizzle-orm'
import { db } from './index'
import {
  courses,
  courseContentSections,
  lessons,
  courseLearningObjectives,
  reviews,
  instructors,
  users,
  categories
} from './schema'
import type { CreateCourseData, UpdateCourseData } from '~/types/shared/courses'
import { enrichCoursesWithInstructors } from '../utils/instructor-service'

// =====================
// Get all courses with filters
// =====================
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
) {
  try {
    const whereConditions = []

    // Category filter - now using categoryId
    if (filter.category) {
      // If category is a number (ID), use it directly
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

    // Build the query with proper field names
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

    // Apply where conditions
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        // @ts-expect-error - Drizzle type issue
        query = query.where(whereConditions[0])
      }
      else {
        // @ts-expect-error - Drizzle type issue
        query = query.where(and(...whereConditions))
      }
    }

    // @ts-expect-error - Drizzle type issue
    query = query.orderBy(desc(courses.createdAt))

    if (limit !== undefined) {
      // @ts-expect-error - Drizzle type issue
      query = query.limit(limit)
    }

    if (offset !== undefined) {
      // @ts-expect-error - Drizzle type issue
      query = query.offset(offset)
    }

    const result = await query

    // Enrich with instructors
    const enrichedCourses = await enrichCoursesWithInstructors(result)

    return enrichedCourses
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

    let query = db.select({ id: courses.id }).from(courses)

    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        // @ts-expect-error - Drizzle type issue
        query = query.where(whereConditions[0])
      }
      else {
        // @ts-expect-error - Drizzle type issue
        query = query.where(and(...whereConditions))
      }
    }

    const result = await query
    return result.length
  }
  catch (error) {
    console.error('Error counting courses:', error)
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
      categoryId: course.categoryId
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
export async function getCourseReviews(courseId: number) {
  const result = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      userName: users.name,
      userAvatar: users.avatar,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.courseId, courseId))

  return result.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment || '',
    createdAt: review.createdAt,
    user: {
      id: review.userId,
      name: review.userName || 'User',
      avatar: review.userAvatar || '/images/default-avatar.png',
    },
  }))
}

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
  console.log('🔍 Looking for course with slug:', slug)

  // 1. Get course
  const courseResult = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1)

  if (!courseResult[0]) {
    console.log('❌ Course not found')
    return null
  }

  const course = courseResult[0]
  console.log('✅ Course found:', course.title, '(ID:', course.id, ')')

  // 2. Get category name
  let categoryName: string | null = null
  if (course.categoryId) {
    const categoryResult = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, course.categoryId))
      .limit(1)

    categoryName = categoryResult[0]?.name || null
    console.log('📁 Category:', categoryName)
  }

  // 3. Get sections
  const sections = await getCourseSections(course.id)
  console.log('📂 Sections found:', sections.length)

  // 4. Get all lessons
  const allLessons = await getCourseLessons(course.id)
  console.log('📝 Lessons found:', allLessons.length)

  // 5. Get learning objectives
  const learningObjectives = await getCourseLearningObjectives(course.id)
  console.log('🎯 Objectives found:', learningObjectives.length)

  // 6. Get reviews
  const courseReviews = await getCourseReviews(course.id)
  console.log('⭐ Reviews found:', courseReviews.length)

  // 7. Get instructor
  const instructor = course.instructorId
    ? await getInstructor(course.instructorId)
    : null
  console.log('👨‍🏫 Instructor:', instructor?.name || 'Not found')

  // 8. Build courseContent structure
  const courseContent = sections.map(section => {
    const sectionLessons = allLessons
      .filter(lesson => lesson.sectionId === section.id)
      .sort((a, b) => a.orderVal - b.orderVal)
      .map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        duration: lesson.duration || '00:00',
        videoUrl: lesson.videoUrl || undefined,
        description: lesson.description || undefined,
        isFree: lesson.isFree || false,
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
    console.log('⚠️ Found', orphanLessons.length, 'orphan lessons')

    if (sections.length === 0) {
      courseContent.push({
        id: 0,
        title: 'Course Lessons',
        description: null,
        lessonsCount: orphanLessons.length,
        content: orphanLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          duration: lesson.duration || '00:00',
          videoUrl: lesson.videoUrl || undefined,
          description: lesson.description || undefined,
          isFree: lesson.isFree || false,
        })),
      })
    }
  }

  console.log('📊 Final courseContent sections:', courseContent.length)
  console.log('📊 Final total lessons in content:', courseContent.reduce((acc, s) => acc + s.content.length, 0))

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
    instructor: instructor ? {
      id: instructor.id,
      name: instructor.name,
      title: instructor.title,
      avatar: instructor.avatar,
      bio: instructor.bio,
    } : null,
    learningObjectives,
    courseContent,
    reviews: courseReviews,
  }
}

export async function getCoursesByInstructorId(instructorId: number): Promise<any[]> {
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

export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
  try {
    // First try to get from categories table
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)

    return result
  } catch (error) {
    // If categories table doesn't exist, return empty
    console.error('Error getting categories:', error)
    return []
  }
}

export async function getAllLevels(): Promise<string[]> {
  const results = await db.select({ level: courses.level }).from(courses).groupBy(courses.level)

  return results.map(result => result.level)
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
