import { db } from '../server/db'
import { courses, reviews } from '../server/db/schema'
import { eq, sql } from 'drizzle-orm'

async function syncReviewsCount() {
  console.log('🔄 Syncing reviewsCount for all courses...\n')

  // Get all courses
  const allCourses = await db
    .select({ id: courses.id, title: courses.title, reviewsCount: courses.reviewsCount })
    .from(courses)

  console.log(`📚 Found ${allCourses.length} courses\n`)

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

      console.log(`✅ Updated: "${course.title}"`)
      console.log(`   Old count: ${currentCount} → New count: ${actualCount}`)
      updatedCount++
    }
    else {
      console.log(`⏭️  Skipped: "${course.title}" (already correct: ${actualCount})`)
      unchangedCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ Sync complete!`)
  console.log(`   Updated: ${updatedCount} courses`)
  console.log(`   Unchanged: ${unchangedCount} courses`)
  console.log('='.repeat(50))
}

syncReviewsCount()
  .catch(console.error)
  .finally(() => process.exit())
