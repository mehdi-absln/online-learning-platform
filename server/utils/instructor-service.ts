// server/utils/instructor-service.ts

import { eq, inArray } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import { formatInstructorName } from './format-utils'
import { processInstructorAvatar } from './image-processor'

/**
 * Standardized instructor info returned from all APIs
 */
export interface InstructorInfo {
  id: number
  name: string
  avatar: string
}

/**
 * Raw instructor data from database
 */
interface RawInstructor {
  id: number
  username: string
}

/**
 * Transform raw instructor to standardized format
 * This is the SINGLE place where instructor data is formatted
 */
export function transformInstructor(
  instructorId: number | null | undefined,
  rawInstructor: RawInstructor | null | undefined
): InstructorInfo | null {
  if (!instructorId) return null

  const name = rawInstructor?.username
    ? formatInstructorName(rawInstructor.username)
    : 'Unknown Instructor'

  return {
    id: instructorId,
    name,
    avatar: processInstructorAvatar(undefined, name),
  }
}

/**
 * Get single instructor by ID
 */
export async function getInstructorById(
  instructorId: number | null | undefined
): Promise<RawInstructor | null> {
  if (!instructorId) return null

  const result = await db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(eq(users.id, instructorId))
    .limit(1)

  return result[0] || null
}

/**
 * Get multiple instructors by IDs (efficient batch query)
 */
export async function getInstructorsByIds(
  instructorIds: number[]
): Promise<Map<number, RawInstructor>> {
  if (!instructorIds.length) return new Map()

  const uniqueIds = [...new Set(instructorIds)]

  const instructors = await db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(inArray(users.id, uniqueIds))

  return new Map(instructors.map(i => [i.id, i]))
}

/**
 * Enrich a single course with instructor info
 */
export async function enrichCourseWithInstructor<T extends { instructorId: number | null }>(
  course: T
): Promise<T & { instructor: InstructorInfo | null }> {
  const rawInstructor = await getInstructorById(course.instructorId)
  const instructor = transformInstructor(course.instructorId, rawInstructor)

  return { ...course, instructor }
}

/**
 * Enrich multiple courses with instructor info (batch)
 */
export async function enrichCoursesWithInstructors<T extends { instructorId: number | null }>(
  courses: T[]
): Promise<(T & { instructor: InstructorInfo | null })[]> {
  if (!courses.length) return []

  const instructorIds = courses
    .map(c => c.instructorId)
    .filter((id): id is number => id !== null && id !== undefined)

  const instructorMap = await getInstructorsByIds(instructorIds)

  return courses.map(course => ({
    ...course,
    instructor: transformInstructor(
      course.instructorId,
      course.instructorId ? instructorMap.get(course.instructorId) : null
    ),
  }))
}