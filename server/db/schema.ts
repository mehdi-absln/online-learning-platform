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
  duration: text('duration').notNull(), // e.g., '12 weeks'
  level: text('level').notNull(), // e.g., 'Beginner', 'Intermediate', 'Advanced'
  tags: text('tags'), // Comma-separated tags for the course
  image: text('image'), // URL to course image
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull(), // Foreign key to courses table
  title: text('title').notNull(),
  content: text('content'), // Content of the lesson
  order: integer('order').notNull(), // Order of the lesson in the course
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
