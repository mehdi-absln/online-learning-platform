import { eq, and, ne, or, like, inArray } from 'drizzle-orm'
import { db } from '../db'
import { courses, reviews, users } from '../db/schema'
import type { Course, Instructor } from '../db/schema'
import { formatInstructorName } from './format-utils'

// Types
interface InstructorInfo {
  id: number
  name: string
  avatar?: string
}

export interface RelatedCourseResult {
  id: number
  title: string
  slug: string
  description: string | null
  category: string
  price: number
  rating: number
  studentCount: number
  image: string | null
  level: string
  instructorId: number
  instructor?: InstructorInfo
  tags: string | null
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
      category: string
      tags: string[]
    }
  }
}

/**
 * Calculate popularity score for a course
 */
export function calculatePopularityScore(
  studentCount: number,
  rating: number,
  createdAt: Date
): number {
  const studentCountScore = studentCount || 0
  const ratingScore = (rating || 0) * 10
  
  // Recency score (max 10 points for courses created in last 30 days)
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const recencyScore = Math.max(0, 10 - Math.floor(daysSinceCreation / 30))
  
  return studentCountScore + ratingScore + recencyScore
}

/**
 * Calculate tag match score between two courses
 */
export function calculateTagMatchScore(
  courseTags: string[],
  targetTags: string[]
): number {
  if (!courseTags.length || !targetTags.length) return 0
  
  const matchCount = courseTags.filter(tag => 
    targetTags.includes(tag.toLowerCase().trim())
  ).length
  
  return matchCount
}

/**
 * Parse tags string to array
 */
export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return []
  return tagsString
    .split(',')
    .map(tag => tag.toLowerCase().trim())
    .filter(Boolean)
}

/**
 * Get related courses for a given course ID
 * This is the main business logic function - framework agnostic
 */
export async function getRelatedCourses(
  options: GetRelatedCoursesOptions
): Promise<GetRelatedCoursesResult> {
  const { courseId, limit = 4 } = options

  // 1. Get the current course
  const currentCourseResult = await db
    .select({
      id: courses.id,
      category: courses.category,
      tags: courses.tags,
    })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)

  if (!currentCourseResult.length) {
    throw new Error('Course not found')
  }

  const currentCourse = currentCourseResult[0]
  const category = currentCourse.category
  const currentTags = parseTags(currentCourse.tags)

  // 2. Build search conditions
  // (same category OR shared tags) AND not the same course
  const tagConditions = currentTags.map(tag =>
    like(courses.tags, `%${tag}%`)
  )

  const searchCondition = and(
    ne(courses.id, courseId),
    tagConditions.length > 0
      ? or(
          eq(courses.category, category),
          ...tagConditions
        )
      : eq(courses.category, category)
  )

  // 3. Fetch potential related courses (without JOIN)
  const potentialCourses = await db
    .select()
    .from(courses)
    .where(searchCondition)
    .limit(10)

  // 4. Get instructor data separately
  const instructorIds = [
    ...new Set(
      potentialCourses
        .map(c => c.instructorId)
        .filter((id): id is number => id !== null && id !== undefined)
    )
  ]

  const instructorsData = instructorIds.length > 0
    ? await db
        .select({
          id: users.id,
          username: users.username,
        })
        .from(users)
        .where(inArray(users.id, instructorIds))
    : []

  const instructorMap = new Map(
    instructorsData.map(i => [i.id, i])
  )

  // 5. Calculate scores and enrich data
  const scoredCourses: RelatedCourseResult[] = await Promise.all(
    potentialCourses.map(async (course) => {
      // Get average rating from reviews
      const courseReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.courseId, course.id))

      const avgRating = courseReviews.length > 0
        ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
        : course.rating || 0

      const courseTags = parseTags(course.tags)
      const instructor = course.instructorId
        ? instructorMap.get(course.instructorId)
        : null

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        category: course.category,
        price: course.price / 100, // Convert from cents to dollars
        rating: avgRating,
        studentCount: course.studentCount || 0,
        image: course.image || '/images/placeholder-course.svg',
        level: course.level,
        instructorId: course.instructorId,
        instructor: instructor ? {
          id: instructor.id,
          name: formatInstructorName(instructor.username),
          avatar: '/images/placeholder-avatar.svg'
        } : undefined,
        tags: course.tags,
        popularityScore: calculatePopularityScore(
          course.studentCount || 0,
          avgRating,
          course.createdAt
        ),
        tagMatchScore: calculateTagMatchScore(courseTags, currentTags),
        categoryMatch: course.category === category,
      }
    })
  )

  // 6. Sort by: category match > tag match score > popularity score
  const sortedCourses = scoredCourses.sort((a, b) => {
    // Priority 1: Category match
    if (a.categoryMatch !== b.categoryMatch) {
      return a.categoryMatch ? -1 : 1
    }
    
    // Priority 2: Tag match score
    if (a.tagMatchScore !== b.tagMatchScore) {
      return b.tagMatchScore - a.tagMatchScore
    }
    
    // Priority 3: Popularity score
    return b.popularityScore - a.popularityScore
  })

  // 7. Return top N courses
  const finalCourses = sortedCourses.slice(0, limit)

  return {
    success: true,
    data: finalCourses,
    meta: {
      total: finalCourses.length,
      basedOn: {
        category,
        tags: currentTags,
      },
    },
  }
}