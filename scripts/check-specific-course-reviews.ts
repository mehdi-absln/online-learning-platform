import { db } from '../server/db'
import { reviews, courses, users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function checkSpecificCourseReviews() {
  // Get all courses
  const allCourses = await db.select({ id: courses.id, title: courses.title, slug: courses.slug }).from(courses)
  
  console.log('🔍 Checking reviews for each course...\n')

  for (const course of allCourses) {
    // Get actual reviews from reviews table
    const courseReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userId: reviews.userId,
      })
      .from(reviews)
      .where(eq(reviews.courseId, course.id))

    console.log(`📋 ${course.title} (${course.slug}):`)
    console.log(`  - Database reviews count: ${courseReviews.length}`)
    console.log(`  - Course table reviewsCount: ${course.reviewsCount}`)
    console.log(`  - Match: ${courseReviews.length === course.reviewsCount ? '✅' : '❌'}`)
    
    if (courseReviews.length > 0) {
      console.log(`  - Sample review: ${courseReviews[0].comment?.substring(0, 50)}...`)
    }
    console.log('')
  }
}

checkSpecificCourseReviews()
  .catch(console.error)
  .finally(() => process.exit())