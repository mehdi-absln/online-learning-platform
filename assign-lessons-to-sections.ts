import { db } from './server/db'
import { courseContentSections, lessons } from './server/db/schema'
import { eq, desc } from 'drizzle-orm'

async function assignLessonsToSections() {
  try {
    // Get all unique course IDs that have lessons
    const courseIdsResult = await db.select({ courseId: lessons.courseId })
      .from(lessons)
      .groupBy(lessons.courseId)

    console.log(`Found ${courseIdsResult.length} courses with lessons.`)

    for (const course of courseIdsResult) {
      console.log(`Processing course ID: ${course.courseId}`)

      // Get all content sections for this course
      const contentSections = await db
        .select()
        .from(courseContentSections)
        .where(eq(courseContentSections.courseId, course.courseId))
        .orderBy(desc(courseContentSections.order))

      if (contentSections.length === 0) {
        console.log(`No content sections found for course ID: ${course.courseId}`)
        continue
      }

      // Get all lessons for this course that don't already have a section assigned
      const unassignedLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.courseId))
        .where(eq(lessons.sectionId, null))

      if (unassignedLessons.length === 0) {
        console.log(`No unassigned lessons found for course ID: ${course.courseId}`)
        continue
      }

      console.log(`Found ${unassignedLessons.length} unassigned lessons for course ID: ${course.courseId}`)

      // Calculate how many lessons should go to each section
      const lessonsPerSection = Math.floor(unassignedLessons.length / contentSections.length)
      const extraLessons = unassignedLessons.length % contentSections.length

      let lessonIndex = 0

      for (let i = 0; i < contentSections.length; i++) {
        const section = contentSections[i]
        // Determine how many lessons this section should get
        const lessonsForThisSection = lessonsPerSection + (i < extraLessons ? 1 : 0)

        console.log(`Assigning ${lessonsForThisSection} lessons to section ID: ${section.id} ("${section.title}")`)

        // Assign lessons to this section
        for (let j = 0; j < lessonsForThisSection && lessonIndex < unassignedLessons.length; j++) {
          const lesson = unassignedLessons[lessonIndex]
          await db
            .update(lessons)
            .set({ sectionId: section.id })
            .where(eq(lessons.id, lesson.id))
          console.log(`  - Assigned lesson ID: ${lesson.id} ("${lesson.title}") to section ID: ${section.id}`)
          lessonIndex++
        }
      }
    }

    console.log('Lessons assignment completed!')
  } catch (error) {
    console.error('Error assigning lessons to sections:', error)
  }
}

assignLessonsToSections()