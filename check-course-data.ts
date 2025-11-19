import { db } from './server/db'
import { courseLearningObjectives, courseContentSections, reviews, courses } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function checkCourse() {
  try {
    // Get the second course (ID: 2) from the database
    const course = await db.select().from(courses).where(eq(courses.id, 2)).limit(1)
    if (course.length === 0) {
      console.log('Course with ID 2 not found.')
      return
    }

    const [objectives, sections, reviewCount] = await Promise.all([
      db.select().from(courseLearningObjectives).where(eq(courseLearningObjectives.courseId, 2)),
      db.select().from(courseContentSections).where(eq(courseContentSections.courseId, 2)),
      db.select().from(reviews).where(eq(reviews.courseId, 2))
    ])

    console.log(`Course title: ${course[0].title}`)
    console.log(`Learning objectives count: ${objectives.length}`)
    console.log(`Content sections count: ${sections.length}`)
    console.log(`Reviews count: ${reviewCount.length}`)
    
    if (objectives.length > 0) {
      console.log('Sample learning objectives:')
      objectives.forEach((obj, index) => {
        console.log(`  ${index + 1}. ${obj.objective}`)
      });
    }
    
    if (sections.length > 0) {
      console.log('Sample content sections:')
      sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (${section.lessonsCount} lessons, ${section.duration})`)
      });
    }
    
    if (reviewCount.length > 0) {
      console.log('Sample reviews:')
      reviewCount.forEach((review, index) => {
        console.log(`  ${index + 1}. ${review.reviewerName}: ${review.rating}/5 - ${review.comment}`)
      });
    }
  } catch (error) {
    console.error('Error checking sample data:', error)
  }
}

checkCourse()