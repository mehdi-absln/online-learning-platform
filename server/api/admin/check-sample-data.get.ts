import { H3Event } from 'h3'
import { db } from '../../../server/db'
import {
  courseLearningObjectives,
  courseContentSections,
  reviews,
  courses
} from '../../../server/db/schema'
import { eq } from 'drizzle-orm'

// Function to check if sample data exists
export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the first course from the database
    const existingCourses = await db.select().from(courses)
    if (existingCourses.length === 0) {
      return {
        success: false,
        message: 'No courses found in the database.'
      }
    }

    const courseId = existingCourses[0].id

    // Check if sample data already exists for this course
    const [objectives, sections, reviewCount] = await Promise.all([
      db
        .select()
        .from(courseLearningObjectives)
        .where(eq(courseLearningObjectives.courseId, courseId)),
      db.select().from(courseContentSections).where(eq(courseContentSections.courseId, courseId)),
      db.select().from(reviews).where(eq(reviews.courseId, courseId))
    ])

    return {
      success: true,
      data: {
        courseId: courseId,
        courseTitle: existingCourses[0].title,
        learningObjectivesCount: objectives.length,
        contentSectionsCount: sections.length,
        reviewsCount: reviewCount.length
      }
    }
  } catch (error) {
    console.error('Error checking sample data:', error)
    return {
      success: false,
      message: 'Failed to check sample data',
      error: (error as Error).message
    }
  }
})
