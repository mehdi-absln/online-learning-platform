import { db } from '../server/db'
import { courses, reviews } from '../server/db/schema'
import { eq, sql } from 'drizzle-orm'

async function syncReviewsCount() {
  // Get all courses
  const allCourses = await db
    .select({ id: courses.id, title: courses.title, reviewsCount: courses.reviewsCount })
    .from(courses)

  let updatedCount = 0
  let unchangedCount = 0

  for (const course of allCourses) {
    // Count actual reviews
    const actualReviews = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.courseId, course.id))

    const actualCount = Number(actualReviews[0]?.count || 0)
    const currentCount = course.reviewsCount || 0

    if (actualCount !== currentCount) {
      // Update the course
      await db
        .update(courses)
        .set({
          reviewsCount: actualCount,
          updatedAt: new Date(),
        })
        .where(eq(courses.id, course.id))

      updatedCount++
    }
    else {
      unchangedCount++
    }
  }

}

syncReviewsCount()
  .finally(() => process.exit())
