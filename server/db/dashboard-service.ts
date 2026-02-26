import { eq, desc, and, inArray } from 'drizzle-orm'
import { db } from './index'
import {
  enrollments,
  courses,
  lessons,
  lessonProgress,
  orders,
} from './schema'

/**
 * Get aggregated dashboard data for a user in a single query batch.
 */
export async function getDashboardData(userId: number) {
  // 1. Enrolled courses with progress
  const enrolledCourses = await getEnrolledCoursesWithProgress(userId)

  // 2. Bookmarked lessons
  const bookmarkedLessons = await getBookmarkedLessons(userId)

  // 3. Recent orders (limit 5)
  const recentOrders = await getRecentOrders(userId)

  // 4. Compute stats
  const totalCompleted = enrolledCourses.reduce(
    (sum, c) => sum + c.completedLessons,
    0,
  )
  const inProgress = enrolledCourses.filter(
    c => c.progressPercentage > 0 && c.progressPercentage < 100,
  ).length

  const stats = {
    totalEnrolled: enrolledCourses.length,
    totalCompleted,
    inProgress,
    totalBookmarked: bookmarkedLessons.length,
  }

  return {
    enrolledCourses,
    stats,
    recentOrders,
    bookmarkedLessons,
  }
}

/**
 * Get all enrolled courses with per-course progress + last accessed lesson.
 */
async function getEnrolledCoursesWithProgress(userId: number) {
  // Get enrolled course IDs
  const enrolled = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.userId, userId))

  if (enrolled.length === 0) return []

  const courseIds = enrolled.map(e => e.courseId)

  // Get course details
  const courseRows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      thumbnail: courses.thumbnail,
    })
    .from(courses)
    .where(inArray(courses.id, courseIds))

  // Get all lessons for these courses
  const courseLessons = await db
    .select({
      id: lessons.id,
      courseId: lessons.courseId,
      title: lessons.title,
      slug: lessons.slug,
      orderVal: lessons.orderVal,
    })
    .from(lessons)
    .where(inArray(lessons.courseId, courseIds))

  // Get user's progress for all lessons in enrolled courses
  const lessonIds = courseLessons.map(l => l.id)
  let progressRows: { lessonId: number, isCompleted: boolean | null, isBookmarked: boolean | null, updatedAt: Date | null }[] = []

  if (lessonIds.length > 0) {
    progressRows = await db
      .select({
        lessonId: lessonProgress.lessonId,
        isCompleted: lessonProgress.isCompleted,
        isBookmarked: lessonProgress.isBookmarked,
        updatedAt: lessonProgress.updatedAt,
      })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          inArray(lessonProgress.lessonId, lessonIds),
        ),
      )
  }

  // Build a lookup: lessonId -> progress
  const progressMap = new Map(progressRows.map(p => [p.lessonId, p]))

  // Build result per course
  return courseRows.map((course) => {
    const cLessons = courseLessons
      .filter(l => l.courseId === course.id)
      .sort((a, b) => a.orderVal - b.orderVal)

    const totalLessons = cLessons.length
    const completedCount = cLessons.filter(
      l => progressMap.get(l.id)?.isCompleted,
    ).length
    const progressPercentage = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0

    // Find "next lesson" using last completed + 1 approach
    // This is simpler than tracking lastAccessedAt timestamps
    let lastAccessedLesson: { title: string, slug: string } | null = null

    // Find the highest completed lesson order
    const completedLessons = cLessons.filter(
      l => progressMap.get(l.id)?.isCompleted,
    )

    if (completedLessons.length > 0) {
      // Get the max order among completed lessons
      const maxCompletedOrder = Math.max(
        ...completedLessons.map(l => l.orderVal),
      )

      // Find the next uncompleted lesson after the last completed one
      const nextLesson = cLessons.find(
        l => l.orderVal > maxCompletedOrder && !progressMap.get(l.id)?.isCompleted,
      )

      if (nextLesson) {
        lastAccessedLesson = { title: nextLesson.title, slug: nextLesson.slug }
      }
    }

    // If no completed lessons, use first uncompleted lesson
    if (!lastAccessedLesson) {
      const firstUncompleted = cLessons.find(
        l => !progressMap.get(l.id)?.isCompleted,
      )
      if (firstUncompleted) {
        lastAccessedLesson = { title: firstUncompleted.title, slug: firstUncompleted.slug }
      }
    }

    // Edge case: All lessons completed → Show last lesson for review
    if (!lastAccessedLesson && cLessons.length > 0) {
      const lastLesson = cLessons[cLessons.length - 1]
      lastAccessedLesson = { title: lastLesson.title, slug: lastLesson.slug }
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail,
      totalLessons,
      completedLessons: completedLessons.length,
      progressPercentage,
      lastAccessedLesson,
    }
  })
}

/**
 * Get bookmarked lessons with course context.
 */
async function getBookmarkedLessons(userId: number) {
  const rows = await db
    .select({
      lessonId: lessonProgress.lessonId,
      lessonTitle: lessons.title,
      lessonSlug: lessons.slug,
      courseTitle: courses.title,
      courseSlug: courses.slug,
    })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
    .innerJoin(courses, eq(lessons.courseId, courses.id))
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.isBookmarked, true),
      ),
    )

  return rows
}

/**
 * Get recent orders for the user.
 */
async function getRecentOrders(userId: number) {
  return await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(5)
}
