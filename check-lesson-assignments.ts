import { db } from './server/db'
import { lessons } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function checkLessonAssignments() {
  try {
    // Count lessons with and without section assignment
    const allLessons = await db.select().from(lessons)
    const assignedLessons = allLessons.filter(lesson => lesson.sectionId !== null)
    const unassignedLessons = allLessons.filter(lesson => lesson.sectionId === null)
    
    console.log(`Total lessons: ${allLessons.length}`)
    console.log(`Assigned lessons: ${assignedLessons.length}`)
    console.log(`Unassigned lessons: ${unassignedLessons.length}`)
    
    if (unassignedLessons.length > 0) {
      console.log('\nUnassigned lessons:')
      for (const lesson of unassignedLessons.slice(0, 10)) { // Show first 10 unassigned lessons
        console.log(`  - Lesson ID: ${lesson.id}, Title: ${lesson.title}, Course ID: ${lesson.courseId}`)
      }
    }
  } catch (error) {
    console.error('Error checking lesson assignments:', error)
  }
}

checkLessonAssignments()