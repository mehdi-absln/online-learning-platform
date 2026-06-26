import { db } from '../server/db'
import { reviews, courses } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function checkSpecificCourseReviews() {
  // Get all courses
  const allCourses = await db.select({ id: courses.id, title: courses.title, slug: courses.slug }).from(courses)


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


    if (courseReviews.length > 0) {
    }
  }
}

checkSpecificCourseReviews()
  .finally(() => process.exit())
