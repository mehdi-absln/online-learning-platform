import { eq, sql } from 'drizzle-orm'
import { db } from './index'
import { reviews, courses, users } from './schema'

// =====================
// Add Review
// =====================
export async function addReview(data: {
  courseId: number
  userId: number
  rating: number
  comment?: string
}) {
  // 1. Insert review
  const [newReview] = await db
    .insert(reviews)
    .values({
      courseId: data.courseId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment || null,
      createdAt: new Date(),
    })
    .returning()

  // 2. Update course stats
  await updateCourseReviewStats(data.courseId)

  return newReview
}

// =====================
// Delete Review
// =====================
export async function deleteReview(reviewId: number) {
  // Get courseId before deleting
  const review = await db
    .select({ courseId: reviews.courseId })
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1)

  if (!review[0]) {
    throw new Error('Review not found')
  }

  const courseId = review[0].courseId

  // Delete review
  await db.delete(reviews).where(eq(reviews.id, reviewId))

  // Update course stats
  await updateCourseReviewStats(courseId)

  return { success: true }
}

// =====================
// Update Course Review Statistics
// =====================
export async function updateCourseReviewStats(courseId: number) {
  // Get all reviews for this course
  const courseReviews = await db
    .select({
      rating: reviews.rating,
    })
    .from(reviews)
    .where(eq(reviews.courseId, courseId))

  const reviewsCount = courseReviews.length
  const averageRating = reviewsCount > 0
    ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
    : 0

  // Update course
  await db
    .update(courses)
    .set({
      reviewsCount,
      rating: Number(averageRating.toFixed(1)),
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId))

  return { reviewsCount, rating: averageRating }
}

// =====================
// Get Course Reviews (enhanced version)
// =====================
export async function getCourseReviews(courseId: number) {
  const result = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      userName: users.name,
      userUsername: users.username,
      userAvatar: users.avatar,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.courseId, courseId))
    .orderBy(sql`${reviews.createdAt} DESC`)

  // ✅ Ensure we always return an array, even if empty or undefined
  if (!result || result.length === 0) {
    return []
  }

  return result.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment || '',
    createdAt: review.createdAt,
    user: {
      id: review.userId,
      name: review.userName || review.userUsername || 'Anonymous',
      avatar: review.userAvatar || '/images/placeholder-avatar.svg',
    },
  }))
}

// =====================
// Check if user can review (enrolled + no existing review)
// =====================
export async function canUserReview(userId: number, courseId: number): Promise<boolean> {
  // Check enrollment
  const enrollment = await db.query.enrollments.findFirst({
    where: (enrollments, { and, eq }) => and(
      eq(enrollments.userId, userId),
      eq(enrollments.courseId, courseId)
    ),
  })

  if (!enrollment) return false

  // Check existing review
  const existingReview = await db.query.reviews.findFirst({
    where: (reviews, { and, eq }) => and(
      eq(reviews.userId, userId),
      eq(reviews.courseId, courseId)
    ),
  })

  return !existingReview
}
