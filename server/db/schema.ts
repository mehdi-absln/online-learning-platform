import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  instructorId: integer('instructor_id').notNull(), // Foreign key to users table
  studentCount: integer('student_count').default(0),
  rating: integer('rating', { mode: 'number' }).default(0), // Rating out of 5
  price: integer('price').notNull(), // Price in cents
  level: text('level').notNull(), // e.g., 'Beginner', 'Intermediate', 'Advanced'
  tags: text('tags'), // Comma-separated tags for the course
  image: text('image'), // URL to course image
  slug: text('slug').notNull().unique(), // URL-friendly slug for the course
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull(), // Foreign key to courses table
  sectionId: integer('section_id'), // Optional foreign key to course content sections
  title: text('title').notNull(),
  content: text('content'), // Content of the lesson
  videoUrl: text('video_url').notNull(), // Required YouTube video URL
  orderVal: integer('order_val').notNull(), // Order of the lesson in the course or section
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Table for course learning objectives
export const courseLearningObjectives = sqliteTable('course_learning_objectives', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull(), // Foreign key to courses table
  objective: text('objective').notNull(), // Description of the learning objective
  orderVal: integer('order_val').notNull(), // Order of the objective in the list
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Table for course content sections
export const courseContentSections = sqliteTable('course_content_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull(), // Foreign key to courses table
  title: text('title').notNull(), // Title of the section
  description: text('description'), // Description of the section
  lessonsCount: integer('lessons_count').notNull(), // Number of lessons in this section
  orderVal: integer('order_val').notNull(), // Order of the section in the course
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Table for course reviews
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull(), // Foreign key to courses table
  reviewerName: text('reviewer_name').notNull(), // Name of the reviewer
  reviewerId: integer('reviewer_id'), // Optional foreign key to users table
  rating: integer('rating', { mode: 'number' }).notNull(), // Rating out of 5
  comment: text('comment'), // Review comment
  date: integer('date', { mode: 'timestamp' }).notNull(), // Date of the review
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})