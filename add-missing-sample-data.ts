import { db } from './server/db'
import { courseLearningObjectives, courseContentSections, reviews, courses } from './server/db/schema'
import { eq } from 'drizzle-orm'

async function addMissingSampleData() {
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

      // Check if sample data already exists for this course
      const [existingObjectives, existingSections, existingReviews] = await Promise.all([
        db.select().from(courseLearningObjectives).where(eq(courseLearningObjectives.courseId, course.id)),
        db.select().from(courseContentSections).where(eq(courseContentSections.courseId, course.id)),
        db.select().from(reviews).where(eq(reviews.courseId, course.id))
      ])

      if (existingObjectives.length > 0 || existingSections.length > 0 || existingReviews.length > 0) {
        console.log(`Sample data already exists for course ID: ${course.id}. Skipping...`)
        continue
      }

      // Add learning objectives for the course
      const learningObjectivesData = [
        {
          courseId: course.id,
          objective: 'Understand the fundamentals of Vue 3 and Composition API',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          objective: 'Learn how to build responsive UIs with Tailwind CSS',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          objective: 'Implement state management with Pinia',
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          objective: 'Create a full-stack Nuxt.js application',
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          objective: 'Deploy applications to production environments',
          order: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await db.insert(courseLearningObjectives).values(learningObjectivesData)
      console.log(`Added learning objectives for course ID: ${course.id}`)

      // Add content sections for the course
      const contentSectionsData = [
        {
          courseId: course.id,
          title: 'Introduction to Vue 3',
          description: 'Learn the basics of Vue 3 and its new features',
          lessonsCount: 5,
          duration: '2 hours',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          title: 'Composition API',
          description: 'Deep dive into Vue 3\'s Composition API',
          lessonsCount: 7,
          duration: '3.5 hours',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          title: 'State Management with Pinia',
          description: 'Managing application state with the new standard',
          lessonsCount: 4,
          duration: '2.5 hours',
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          title: 'UI Development with Tailwind CSS',
          description: 'Building responsive and beautiful UIs',
          lessonsCount: 6,
          duration: '3 hours',
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          title: 'Nuxt.js Fundamentals',
          description: 'Server-side rendering and routing with Nuxt',
          lessonsCount: 8,
          duration: '4 hours',
          order: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await db.insert(courseContentSections).values(contentSectionsData)
      console.log(`Added content sections for course ID: ${course.id}`)

      // Add reviews for the course
      const reviewsData = [
        {
          courseId: course.id,
          reviewerName: 'Alice Johnson',
          rating: 5,
          comment: 'Excellent course! The instructor explains complex concepts very clearly.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // A week ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          reviewerName: 'Bob Smith',
          rating: 4,
          comment: 'Good content, but some examples could be more practical.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          reviewerName: 'Carol Davis',
          rating: 5,
          comment: 'One of the best Vue.js courses I have taken. Highly recommended!',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: course.id,
          reviewerName: 'David Wilson',
          rating: 3,
          comment: 'Decent content but could use more exercises.',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Two weeks ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await db.insert(reviews).values(reviewsData)
      console.log(`Added reviews for course ID: ${course.id}`)

      console.log(`Sample data added successfully for course ID: ${course.id}`)
    }

    console.log('Sample data added for all courses!')
  } catch (error) {
    console.error('Error adding sample data:', error)
  }
}

addMissingSampleData()