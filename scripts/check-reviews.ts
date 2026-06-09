import { db } from '../server/db'
import { reviews, courses, users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function checkReviews() {
  console.log('🔍 Checking reviews table...\n')

  // 1. Count total reviews
  const allReviews = await db.select().from(reviews)
  console.log(`📊 Total reviews in database: ${allReviews.length}`)

  if (allReviews.length === 0) {
    console.log('⚠️  No reviews found! Database is empty.\n')
    return
  }

  // 2. Show all reviews
  console.log('\n📋 All reviews:')
  for (const review of allReviews) {
    const course = await db
      .select({ title: courses.title })
      .from(courses)
      .where(eq(courses.id, review.courseId))
      .limit(1)

    const user = await db
      .select({ name: users.name, username: users.username })
      .from(users)
      .where(eq(users.id, review.userId))
      .limit(1)

    console.log({
      id: review.id,
      course: course[0]?.title || 'Unknown',
      user: user[0]?.name || user[0]?.username || 'Unknown',
      rating: review.rating,
      comment: review.comment?.substring(0, 50) + '...',
      createdAt: review.createdAt,
    })
  }

  // 3. Group by course
  console.log('\n📊 Reviews per course:')
  const reviewsByCourse = allReviews.reduce((acc, review) => {
    acc[review.courseId] = (acc[review.courseId] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  for (const [courseId, count] of Object.entries(reviewsByCourse)) {
    const course = await db
      .select({ title: courses.title, slug: courses.slug })
      .from(courses)
      .where(eq(courses.id, Number(courseId)))
      .limit(1)

    console.log(`  - ${course[0]?.title} (${course[0]?.slug}): ${count} reviews`)
  }
}

checkReviews()
  .catch(console.error)
  .finally(() => process.exit())