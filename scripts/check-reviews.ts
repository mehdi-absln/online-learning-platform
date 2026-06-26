import { db } from '../server/db'
import { reviews, courses, users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function checkReviews() {

  // 1. Count total reviews
  const allReviews = await db.select().from(reviews)

  if (allReviews.length === 0) {
    return
  }

  // 2. Show all reviews
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

  }

  // 3. Group by course
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

  }
}

checkReviews()
  .finally(() => process.exit())
