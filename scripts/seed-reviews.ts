import { db } from '../server/db'
import { reviews, courses, users } from '../server/db/schema'

async function seedReviews() {
  console.log('🌱 Seeding reviews...\n')

  // Get first 3 courses
  const allCourses = await db.select({ id: courses.id, title: courses.title }).from(courses).limit(3)
  
  // Get first 5 users
  const allUsers = await db.select({ id: users.id, name: users.name }).from(users).limit(5)

  if (allCourses.length === 0) {
    console.log('❌ No courses found! Please seed courses first.')
    return
  }

  if (allUsers.length === 0) {
    console.log('❌ No users found! Please seed users first.')
    return
  }

  const sampleReviews = [
    // Course 1
    { courseId: allCourses[0].id, userId: allUsers[0]?.id || 1, rating: 5, comment: 'Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.' },
    { courseId: allCourses[0].id, userId: allUsers[1]?.id || 2, rating: 4, comment: 'Great content but could use more practical examples. Overall very helpful!' },
    { courseId: allCourses[0].id, userId: allUsers[2]?.id || 3, rating: 5, comment: 'Best course I have taken so far. Highly recommended for beginners and advanced learners.' },
    
    // Course 2 (if exists)
    ...(allCourses[1] ? [
      { courseId: allCourses[1].id, userId: allUsers[0]?.id || 1, rating: 4, comment: 'Good course for beginners. Instructor explains concepts clearly and provides useful resources.' },
      { courseId: allCourses[1].id, userId: allUsers[3]?.id || 4, rating: 5, comment: 'Amazing! Learned so much in just a few weeks. The projects were very engaging.' },
    ] : []),
    
    // Course 3 (if exists)
    ...(allCourses[2] ? [
      { courseId: allCourses[2].id, userId: allUsers[1]?.id || 2, rating: 3, comment: 'Decent content but the pacing is a bit slow. Could be more concise.' },
      { courseId: allCourses[2].id, userId: allUsers[4]?.id || 5, rating: 4, comment: 'Very informative and practical. Would recommend to anyone interested in this topic.' },
    ] : []),
  ]

  let insertedCount = 0
  for (const review of sampleReviews) {
    try {
      await db.insert(reviews).values({
        ...review,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      })
      insertedCount++
      console.log(`✅ Added review for course ${review.courseId} by user ${review.userId}`)
    } catch (error: any) {
      console.error(`❌ Failed to insert review:`, error.message)
    }
  }

  console.log(`\n✨ Successfully seeded ${insertedCount} reviews!`)
}

seedReviews()
  .catch(console.error)
  .finally(() => process.exit())