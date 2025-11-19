import { db } from './server/db'
import { lessons, courses, courseContentSections } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function addSampleLessons() {
  try {
    // Get all courses from the database
    const existingCourses = await db.select().from(courses)
    if (existingCourses.length === 0) {
      console.log('No courses found in the database.')
      return
    }

    console.log(`Found ${existingCourses.length} courses in the database.`)

    for (const course of existingCourses) {
      console.log(`Processing course ID: ${course.id}, Title: ${course.title}`)

      // Check if lessons already exist for this course
      const existingLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))

      if (existingLessons.length > 0) {
        console.log(`Lessons already exist for course ID: ${course.id}. Skipping...`)
        continue
      }

      // Get content sections for this course to create lessons for each section
      const contentSections = await db
        .select()
        .from(courseContentSections)
        .where(eq(courseContentSections.courseId, course.id))

      if (contentSections.length === 0) {
        console.log(`No content sections found for course ID: ${course.id}. Cannot create lessons.`)
        continue
      }

      // Create sample lessons based on content sections
      for (const section of contentSections) {
        // Create a variable number of lessons for each section (between 2 and 5)
        const lessonsCount = Math.floor(Math.random() * 4) + 2 // Random number between 2-5
        
        for (let i = 0; i < lessonsCount; i++) {
          const lessonTitle = `${section.title} - Lesson ${i + 1}`
          
          await db.insert(lessons).values({
            courseId: course.id,
            sectionId: section.id, // Assign lesson to the current section
            title: lessonTitle,
            content: `This is the content for ${lessonTitle}. Students will learn important concepts detailed in this lesson.`,
            order: i + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          
          console.log(`  Added lesson: ${lessonTitle} to section: ${section.title}`)
        }
      }

      console.log(`Sample lessons added successfully for course ID: ${course.id}`)
    }

    console.log('Sample lessons added for all courses!')
  } catch (error) {
    console.error('Error adding sample lessons:', error)
  }
}

addSampleLessons()