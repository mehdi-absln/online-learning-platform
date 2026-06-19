import { eq, and, ne, or, like, isNull } from 'drizzle-orm'
import { db } from '../db'
import { courses, reviews, categories } from '../db/schema'
import { enrichCoursesWithInstructors } from './instructor-service'
import { processCourseImage, DEFAULT_COURSE_IMAGE, DEFAULT_INSTRUCTOR_AVATAR } from './image-processor'

export interface RelatedCourseResult {
  id: number
  title: string
  slug: string
  description: string | null
  category: string
  price: number
  rating: number
  studentCount: number
  thumbnail: string
  level: string
  instructorId: number
  instructor: {
    id: number
    name: string
    avatar: string
  }
  stats: {
    students: number
  }
  tags: string | undefined
  createdAt: Date
  updatedAt: Date
  popularityScore: number
  tagMatchScore: number
  categoryMatch: boolean
}

export interface GetRelatedCoursesOptions {
  courseId: number
  limit?: number
}

export interface GetRelatedCoursesResult {
  success: boolean
  data: RelatedCourseResult[]
  meta: {
    total: number
    basedOn: {
      category: string | null
      tags: string[]
    }
  }
}

export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return []
  return tagsString
    .split(',')
    .map(tag => tag.toLowerCase().trim())
    .filter(Boolean)
}

export function calculatePopularityScore(
  studentCount: number,
  rating: number,
  createdAt: Date,
): number {
  const studentCountScore = studentCount || 0
  const ratingScore = (rating || 0) * 10
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  const recencyScore = Math.max(0, 10 - Math.floor(daysSinceCreation / 30))

  return studentCountScore + ratingScore + recencyScore
}

export function calculateTagMatchScore(
  courseTags: string[],
  targetTags: string[],
): number {
  if (!courseTags.length || !targetTags.length) return 0
  return courseTags.filter(tag => targetTags.includes(tag.toLowerCase().trim())).length
}

export async function getRelatedCourses(
  options: GetRelatedCoursesOptions,
): Promise<GetRelatedCoursesResult> {
  const { courseId, limit = 4 } = options

  const currentCourseResult = await db
    .select({
      id: courses.id,
      categoryId: courses.categoryId,
      tags: courses.tags,
    })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)

  if (!currentCourseResult.length) {
    throw new Error('Course not found')
  }

  const currentCourse = currentCourseResult[0]!
  const categoryId = currentCourse.categoryId
  const currentTags = parseTags(currentCourse.tags)

  const tagConditions = currentTags.map(tag => like(courses.tags, `%${tag}%`))

  const categoryCondition = categoryId !== null
    ? eq(courses.categoryId, categoryId)
    : isNull(courses.categoryId)

  const searchCondition = and(
    ne(courses.id, courseId),
    tagConditions.length > 0
      ? or(categoryCondition, ...tagConditions)
      : categoryCondition,
  )

  const potentialCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
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
      createdAt: courses.createdAt,
      updatedAt: courses.updatedAt,
    })
    .from(courses)
    .leftJoin(categories, eq(courses.categoryId, categories.id))
    .where(searchCondition)
    .limit(10)

  const enrichedCourses = await enrichCoursesWithInstructors(potentialCourses)

  const scoredCourses = await Promise.all(
    enrichedCourses.map(async (course) => {
      const courseReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.courseId, course.id))

      const avgRating = courseReviews.length > 0
        ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
        : course.rating || 0

      const courseTags = parseTags(course.tags)

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        category: course.category || 'Uncategorized',
        price: course.price / 100,
        rating: avgRating,
        studentCount: course.studentCount || 0,
        thumbnail: processCourseImage(course.thumbnail) || DEFAULT_COURSE_IMAGE,
        level: course.level,
        instructorId: course.instructorId || 0,
        instructor: course.instructor || {
          id: 0,
          name: 'Unknown',
          avatar: DEFAULT_INSTRUCTOR_AVATAR,
        },
        stats: {
          students: course.studentCount || 0,
        },
        tags: course.tags || undefined,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        popularityScore: calculatePopularityScore(
          course.studentCount || 0,
          avgRating,
          course.createdAt,
        ),
        tagMatchScore: calculateTagMatchScore(courseTags, currentTags),
        categoryMatch: course.categoryId === categoryId,
      }
    }),
  )

  const sortedCourses = scoredCourses.sort((a, b) => {
    if (a.categoryMatch !== b.categoryMatch) return a.categoryMatch ? -1 : 1
    if (a.tagMatchScore !== b.tagMatchScore) return b.tagMatchScore - a.tagMatchScore
    return b.popularityScore - a.popularityScore
  })

  return {
    success: true,
    data: sortedCourses.slice(0, limit) as RelatedCourseResult[],
    meta: {
      total: Math.min(sortedCourses.length, limit),
      basedOn: { category: categoryId?.toString() || null, tags: currentTags },
    },
  }
}
