import { db } from './server/db'
import { courseLearningObjectives, courseContentSections, reviews, courses } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function checkSampleData() {
  try {
    // Get the first course from the database
    const existingCourses = await db.select().from(courses)
    if (existingCourses.length === 0) {
      console.log('No courses found in the database.')
      return
    }

    const courseId = existingCourses[0].id
    console.log(`Checking sample data for course ID: ${courseId}`)

    // Check if sample data already exists for this course
    const [objectives, sections, reviewCount] = await Promise.all([
      db.select().from(courseLearningObjectives).where(eq(courseLearningObjectives.courseId, courseId)),
      db.select().from(courseContentSections).where(eq(courseContentSections.courseId, courseId)),
      db.select().from(reviews).where(eq(reviews.courseId, courseId))
    ])

    console.log(`Course title: ${existingCourses[0].title}`)
    console.log(`Learning objectives count: ${objectives.length}`)
    console.log(`Content sections count: ${sections.length}`)
    console.log(`Reviews count: ${reviewCount.length}`)
    
    if (objectives.length > 0) {
      console.log('Sample learning objectives:')
      objectives.forEach((obj, index) => {
        console.log(`  ${index + 1}. ${obj.objective}`)
      })
    }
    
    if (sections.length > 0) {
      console.log('Sample content sections:')
      sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (${section.lessonsCount} lessons, ${section.duration})`)
      })
    }
    
    if (reviewCount.length > 0) {
      console.log('Sample reviews:')
      reviewCount.forEach((review, index) => {
        console.log(`  ${index + 1}. ${review.reviewerName}: ${review.rating}/5 - ${review.comment}`)
      })
    }
  } catch (error) {
    console.error('Error checking sample data:', error)
  }
}

checkSampleData()