import { db } from './server/db'
import { lessons, courseContentSections } from './server/db/schema'
import { eq, desc } from 'drizzle-orm'

async function assignRemainingLessons() {
  try {
    // Get content sections for course ID 23
    const contentSections = await db
      .select()
      .from(courseContentSections)
      .where(eq(courseContentSections.courseId, 23))
      .orderBy(desc(courseContentSections.order))

    if (contentSections.length === 0) {
      console.log('No content sections found for course ID: 23')
      return
    }

    // Get the 3 unassigned lessons for course ID 23
    const unassignedLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, 23))
      .where(eq(lessons.sectionId, null))

    console.log(`Found ${unassignedLessons.length} unassigned lessons for course ID: 23`)

    // Assign lessons to sections
    for (let i = 0; i < unassignedLessons.length; i++) {
      const lesson = unassignedLessons[i]
      const section = contentSections[i % contentSections.length] // Cycle through sections if more lessons than sections

      await db
        .update(lessons)
        .set({ sectionId: section.id })
        .where(eq(lessons.id, lesson.id))
      console.log(`Assigned lesson ID: ${lesson.id} ("${lesson.title}") to section ID: ${section.id} ("${section.title}")`)
    }

    console.log('Remaining lessons assignment completed!')
  } catch (error) {
    console.error('Error assigning remaining lessons:', error)
  }
}

assignRemainingLessons()