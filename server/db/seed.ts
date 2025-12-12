import { db } from './index'
import {
  courses,
  users,
  courseLearningObjectives,
  courseContentSections,
  reviews,
  lessons,
} from './schema'
import { hash } from 'bcrypt'

async function seedDatabase() {
  console.log('Seeding database...')

  // Create an instructor user
  const instructorEmail = 'instructor@example.com'
  const instructorPassword = await hash('password123', 10)
  const [instructor] = await db
    .insert(users)
    .values({
      username: 'John Instructor',
      email: instructorEmail,
      passwordHash: instructorPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  // Create a regular user for reviews
  const studentEmail = 'student@example.com'
  const studentPassword = await hash('password123', 10)
  const [student] = await db
    .insert(users)
    .values({
      username: 'Jane Student',
      email: studentEmail,
      passwordHash: studentPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  // Create a sample course
  const [course] = await db
    .insert(courses)
    .values({
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript concepts and techniques',
      category: 'Programming',
      instructorId: instructor.id,
      studentCount: 120,
      rating: 4.7,
      price: 9999, // $99.99 in cents
      level: 'Advanced',
      tags: 'typescript,javascript,programming',
      image: '/images/typescript-course.jpg',
      slug: 'advanced-typescript',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  // Add learning objectives for the course
  const learningObjectivesData = [
    {
      courseId: course.id,
      objective: 'Understand advanced TypeScript features like generics and decorators',
      orderVal: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      objective: 'Learn to write type-safe code with complex type systems',
      orderVal: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      objective: 'Implement design patterns using TypeScript',
      orderVal: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      objective: 'Create scalable applications with TypeScript',
      orderVal: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(courseLearningObjectives).values(learningObjectivesData)

  // Add content sections for the course
  const contentSectionsData = [
    {
      courseId: course.id,
      title: 'Advanced Types',
      description: 'Deep dive into TypeScript\'s type system',
      lessonsCount: 5,
      orderVal: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      title: 'Generics and Decorators',
      description: 'Learn to use generics and decorators effectively',
      lessonsCount: 4,
      orderVal: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      title: 'Type-Safe Design Patterns',
      description: 'Implementing design patterns with TypeScript',
      lessonsCount: 6,
      orderVal: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      title: 'Testing and Performance',
      description: 'Advanced testing and performance optimization',
      lessonsCount: 3,
      orderVal: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(courseContentSections).values(contentSectionsData)

  // Add some lessons to the course
  const lessonsData = [
    {
      courseId: course.id,
      title: 'Introduction to Advanced Types',
      content: 'In this lesson, we cover union types, intersection types, and conditional types.',
      orderVal: 1,
      slug: 'introduction-to-advanced-types',
      videoUrl: 'https://example.com/video1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      title: 'Working with Generics',
      content: 'Learn how to create reusable and type-safe components using generics.',
      orderVal: 2,
      slug: 'working-with-generics',
      videoUrl: 'https://example.com/video2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      title: 'Understanding Decorators',
      content: 'Exploring TypeScript decorators and how to create custom decorators.',
      orderVal: 3,
      slug: 'understanding-decorators',
      videoUrl: 'https://example.com/video3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(lessons).values(lessonsData)

  // Add reviews for the course
  const reviewsData = [
    {
      courseId: course.id,
      reviewerName: 'Alice Johnson',
      reviewerId: student.id,
      rating: 5,
      comment: 'Excellent course! The instructor explains complex concepts very well.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // A week ago
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      reviewerName: 'Bob Smith',
      rating: 4,
      comment: 'Good content but some examples could be more practical.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: course.id,
      reviewerName: 'Carol Davis',
      rating: 5,
      comment: 'One of the best TypeScript courses I have taken. Highly recommended!',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(reviews).values(reviewsData)

  console.log('Database seeded successfully!')
}

seedDatabase().catch(console.error)
