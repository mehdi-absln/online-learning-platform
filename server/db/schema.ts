import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
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
}, table => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}))

// =====================
// Users Table
// =====================
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  role: text('role').default('student'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  usernameIdx: index('users_username_idx').on(table.username),
  emailIdx: index('users_email_idx').on(table.email),
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
}, table => ({
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
}, table => ({
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
}, table => ({
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
}, table => ({
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
// Lesson Progress Table
// =====================
export const lessonProgress = sqliteTable('lesson_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  isBookmarked: integer('is_bookmarked', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  progressPercentage: integer('progress_percentage').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('progress_user_id_idx').on(table.userId),
  lessonIdIdx: index('progress_lesson_id_idx').on(table.lessonId),
  uniqueUserLesson: index('progress_user_lesson_idx').on(table.userId, table.lessonId),
}))
// =====================
// Blogs Table
// =====================
export const blogs = sqliteTable('blogs', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),

  content: text('content').notNull(),
  excerpt: text('excerpt'),

  coverImage: text('cover_image'),

  status: text('status').notNull().default('draft'),

  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  readingTime: integer('reading_time').notNull().default(1),

  publishedAt: integer('published_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  slugIdx: index('blogs_slug_idx').on(table.slug),
  authorIdx: index('blogs_author_id_idx').on(table.authorId),
  statusIdx: index('blogs_status_idx').on(table.status),
}))

// =====================
// Cart Items Table
// =====================
export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('cart_user_id_idx').on(table.userId),
  uniqueUserCourse: uniqueIndex('cart_user_course_idx').on(table.userId, table.courseId),
}))

// =====================
// Orders Table
// =====================
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, failed
  paymentRef: text('payment_ref'),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
}))

// =====================
// Order Items Table
// =====================
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  price: real('price').notNull(),
}, table => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
}))

// =====================
// Enrollments Table
// =====================
export const enrollments = sqliteTable('enrollments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'set null' }),
  enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('enrollments_user_id_idx').on(table.userId),
  uniqueUserCourse: uniqueIndex('enrollments_user_course_idx').on(table.userId, table.courseId),
}))

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

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}))

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [cartItems.courseId],
    references: [courses.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  enrollments: many(enrollments),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  course: one(courses, {
    fields: [orderItems.courseId],
    references: [courses.id],
  }),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  order: one(orders, {
    fields: [enrollments.orderId],
    references: [orders.id],
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
export type LessonProgress = typeof lessonProgress.$inferSelect
export type NewLessonProgress = typeof lessonProgress.$inferInsert
export type Blog = typeof blogs.$inferSelect
export type NewBlog = typeof blogs.$inferInsert
export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type Enrollment = typeof enrollments.$inferSelect
export type NewEnrollment = typeof enrollments.$inferInsert
