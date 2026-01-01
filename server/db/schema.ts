import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// =====================
// Categories Table
// =====================
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}))

// =====================
// Users Table
// =====================
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: text('role').default('student'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  slugIdx: index('users_email_idx').on(table.email),
}))

// =====================
// Instructors Table
// =====================
export const instructors = sqliteTable('instructors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  title: text('title'),
  bio: text('bio'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('instructors_user_id_idx').on(table.userId),
}))

// =====================
// Courses Table
// =====================
export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  price: real('price').notNull().default(0),
  originalPrice: real('original_price'),
  thumbnail: text('thumbnail'),
  instructorId: integer('instructor_id').references(() => instructors.id),
  categoryId: integer('category_id'),
  level: text('level').default('beginner'),
  language: text('language').default('en'),
  duration: text('duration'),
  lessonsCount: integer('lessons_count').default(0),
  studentsCount: integer('students_count').default(0),
  rating: real('rating').default(0),
  reviewsCount: integer('reviews_count').default(0),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  tags: text('tags'),
}, (table) => ({
  slugIdx: index('courses_slug_idx').on(table.slug),
}))

// =====================
// Course Content Sections Table
// =====================
export const courseContentSections = sqliteTable('course_content_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  orderVal: integer('order_val').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  courseIdIdx: index('sections_course_id_idx').on(table.courseId),
}))

// =====================
// Lessons Table
// =====================
export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  sectionId: integer('section_id').references(() => courseContentSections.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: text('duration'),
  orderVal: integer('order_val').notNull().default(0),
  isFree: integer('is_free', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  courseIdIdx: index('lessons_course_id_idx').on(table.courseId),
  sectionIdIdx: index('lessons_section_id_idx').on(table.sectionId),
}))

// =====================
// Course Learning Objectives Table
// =====================
export const courseLearningObjectives = sqliteTable('course_learning_objectives', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  objective: text('objective').notNull(),
  orderVal: integer('order_val').notNull().default(0),
})

// =====================
// Reviews Table
// =====================
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// =====================
// Relations
// =====================
export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(instructors, {
    fields: [courses.instructorId],
    references: [instructors.id],
  }),
  sections: many(courseContentSections),
  lessons: many(lessons),
  objectives: many(courseLearningObjectives),
  reviews: many(reviews),
}))

export const sectionsRelations = relations(courseContentSections, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseContentSections.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  section: one(courseContentSections, {
    fields: [lessons.sectionId],
    references: [courseContentSections.id],
  }),
}))

// =====================
// Types
// =====================
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Instructor = typeof instructors.$inferSelect
export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
export type CourseContentSection = typeof courseContentSections.$inferSelect
export type Lesson = typeof lessons.$inferSelect
export type NewLesson = typeof lessons.$inferInsert
export type Review = typeof reviews.$inferSelect
