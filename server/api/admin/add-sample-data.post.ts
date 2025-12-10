import { H3Event } from 'h3'
import { db } from '../../../server/db'
import {
  courseLearningObjectives,
  courseContentSections,
  reviews,
  courses
} from '../../../server/db/schema'
import { and, eq } from 'drizzle-orm'

// Function to add sample data for a specific course
export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the first course from the database
    const existingCourses = await db.select().from(courses)
    if (existingCourses.length === 0) {
      return {
        success: false,
        message: 'No courses found in the database. Please create a course first.'
      }
    }

    // Using the first course for adding sample data
    const course = existingCourses[0]
    if (!course) {
      return {
        success: false,
        message: 'No courses found in the database. Please create a course first.'
      }
    }
    const courseId = course.id

    // Check if sample data already exists for this course
    const existingObjectives = await db
      .select()
      .from(courseLearningObjectives)
      .where(eq(courseLearningObjectives.courseId, courseId))

    if (existingObjectives.length > 0) {
      return {
        success: false,
        message: `Sample data already exists for course ID: ${courseId}`
      }
    }

    // Add learning objectives for the course
    const learningObjectivesData = [
      {
        courseId: courseId,
        objective: 'Understand the fundamentals of Vue 3 and Composition API',
        orderVal: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        objective: 'Learn how to build responsive UIs with Tailwind CSS',
        orderVal: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        objective: 'Implement state management with Pinia',
        orderVal: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        objective: 'Create a full-stack Nuxt.js application',
        orderVal: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        objective: 'Deploy applications to production environments',
        orderVal: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.insert(courseLearningObjectives).values(learningObjectivesData)

    // Add content sections for the course
    const contentSectionsData = [
      {
        courseId: courseId,
        title: 'Introduction to Vue 3',
        description: 'Learn the basics of Vue 3 and its new features',
        lessonsCount: 5,
        orderVal: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        title: 'Composition API',
        description: "Deep dive into Vue 3's Composition API",
        lessonsCount: 7,
        orderVal: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        title: 'State Management with Pinia',
        description: 'Managing application state with the new standard',
        lessonsCount: 4,
        orderVal: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        title: 'UI Development with Tailwind CSS',
        description: 'Building responsive and beautiful UIs',
        lessonsCount: 6,
        orderVal: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        title: 'Nuxt.js Fundamentals',
        description: 'Server-side rendering and routing with Nuxt',
        lessonsCount: 8,
        orderVal: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.insert(courseContentSections).values(contentSectionsData)

    // Add reviews for the course
    const reviewsData = [
      {
        courseId: courseId,
        reviewerName: 'Alice Johnson',
        rating: 5,
        comment: 'Excellent course! The instructor explains complex concepts very clearly.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // A week ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        reviewerName: 'Bob Smith',
        rating: 4,
        comment: 'Good content, but some examples could be more practical.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        reviewerName: 'Carol Davis',
        rating: 5,
        comment: 'One of the best Vue.js courses I have taken. Highly recommended!',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: courseId,
        reviewerName: 'David Wilson',
        rating: 3,
        comment: 'Decent content but could use more exercises.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Two weeks ago
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.insert(reviews).values(reviewsData)

    return {
      success: true,
      message: `Sample data added successfully for course ID: ${courseId}`,
      courseId: courseId
    }
  } catch (error) {
    console.error('Error adding sample data:', error)
    return {
      success: false,
      message: 'Failed to add sample data',
      error: (error as Error).message
    }
  }
})
