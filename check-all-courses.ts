import { db } from './server/db'
import { lessons, courses } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function checkAllCourses() {
  try {
    // Get all courses
    const allCourses = await db.select().from(courses)
    
    console.log(`Found ${allCourses.length} total courses:`)
    let totalLessons = 0
    
    for (const course of allCourses) {
      console.log(`  - Course ID: ${course.id}, Title: ${course.title}`)
      
      // Count lessons for this course
      const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, course.id))
      console.log(`    Lessons: ${courseLessons.length}`)
      totalLessons += courseLessons.length
    }
    
    console.log(`\nTotal lessons across all courses: ${totalLessons}`)
  } catch (error) {
    console.error('Error checking all courses:', error)
  }
}

checkAllCourses()