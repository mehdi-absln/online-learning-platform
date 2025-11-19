import { db } from './server/db'
import { lessons, courseContentSections } from './server/db/schema'
import { eq, and } from 'drizzle-orm'

async function checkLessonsAndSections() {
  try {
    // Get all courses that have lessons
    const coursesWithLessons = await db.select({ courseId: lessons.courseId })
      .from(lessons)
      .groupBy(lessons.courseId)

    console.log(`Found ${coursesWithLessons.length} courses with lessons:`)
    for (const course of coursesWithLessons) {
      console.log(`  - Course ID: ${course.courseId}`)

      // Count lessons with and without section assignment
      const totalLessons = await db.select().from(lessons).where(eq(lessons.courseId, course.courseId))
      const assignedLessons = totalLessons.filter(lesson => lesson.sectionId !== null)
      const unassignedLessons = totalLessons.filter(lesson => lesson.sectionId === null)

      console.log(`    Total lessons: ${totalLessons.length}`)
      console.log(`    Assigned lessons: ${assignedLessons.length}`)
      console.log(`    Unassigned lessons: ${unassignedLessons.length}`)

      // Count sections
      const sections = await db.select().from(courseContentSections).where(eq(courseContentSections.courseId, course.courseId))
      console.log(`    Sections: ${sections.length}`)
    }
  } catch (error) {
    console.error('Error checking lessons and sections:', error)
  }
}

checkLessonsAndSections()