import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.sqlite')

console.log('🗄️  Setting up database at:', DB_PATH)

// Create database
const sqlite = new Database(DB_PATH)
const db = drizzle(sqlite)

// Create tables directly with SQL
const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'student',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar TEXT,
  created_at INTEGER NOT NULL
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price REAL NOT NULL DEFAULT 0,
  original_price REAL,
  thumbnail TEXT,
  instructor_id INTEGER REFERENCES instructors(id),
  category_id INTEGER,
  level TEXT DEFAULT 'beginner',
  language TEXT DEFAULT 'fa',
  duration TEXT,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Course Content Sections table
CREATE TABLE IF NOT EXISTS course_content_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_val INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_id INTEGER REFERENCES course_content_sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration TEXT,
  order_val INTEGER NOT NULL DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Course Learning Objectives table
CREATE TABLE IF NOT EXISTS course_learning_objectives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  order_val INTEGER NOT NULL DEFAULT 0
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at INTEGER NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_section_id ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_sections_course_id ON course_content_sections(course_id);
`

console.log('📝 Creating tables...')
sqlite.exec(createTablesSQL)
console.log('✅ Tables created successfully!')

// Seed data
const now = Math.floor(Date.now() / 1000)

console.log('🌱 Seeding database...')

// Insert instructor
const insertInstructor = sqlite.prepare(`
  INSERT INTO instructors (name, title, bio, avatar, created_at)
  VALUES (?, ?, ?, ?, ?)
`)
const instructorResult = insertInstructor.run(
  'Ali Ahmadi',
  'Senior Full-Stack Developer',
  'Senior developer with over 10 years of experience in web development',
  '/images/instructors/ali.jpg',
  now
)
const instructorId = instructorResult.lastInsertRowid

console.log('👨‍🏫 Instructor created with ID:', instructorId)

// Insert course
const insertCourse = sqlite.prepare(`
  INSERT INTO courses (
    title, slug, description, short_description, price, original_price,
    thumbnail, instructor_id, level, language, duration, lessons_count,
    students_count, rating, reviews_count, is_featured, is_published,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const courseResult = insertCourse.run(
  'Comprehensive Vue.js 3 and Nuxt 3 Course',
  'vue-js-3-nuxt-3-complete',
  'In this comprehensive course, you will learn Vue.js 3 and Nuxt 3 from scratch to advanced. You will become familiar with Composition API, Pinia, Vue Router and many other features.',
  'Complete Vue 3 and Nuxt 3 course from beginner to advanced',
  299000,
  499000,
  '/images/courses/vue-nuxt-course.jpg',
  instructorId,
  'intermediate',
  'en',
  '15 hours',
  12,
  1250,
  4.8,
  89,
  1,
  1,
  now,
  now
)
const courseId = courseResult.lastInsertRowid

console.log('📚 Course created with ID:', courseId)

// Insert sections
const insertSection = sqlite.prepare(`
  INSERT INTO course_content_sections (course_id, title, description, order_val, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`)

const sections = [
  { title: 'Introduction to Vue.js', description: 'Getting familiar with Vue.js and installation', order: 1 },
  { title: 'Vue.js Basic Concepts', description: 'Components, Props, Events and Slots', order: 2 },
  { title: 'Composition API', description: 'ref, reactive, computed and watch', order: 3 },
  { title: 'Introduction to Nuxt 3', description: 'Project structure and Server-Side Rendering', order: 4 },
]

const sectionIds = []
for (const section of sections) {
  const result = insertSection.run(
    courseId,
    section.title,
    section.description,
    section.order,
    now,
    now
  )
  sectionIds.push(Number(result.lastInsertRowid))
}

console.log('📂 Sections created:', sectionIds.length)

// Insert lessons
const insertLesson = sqlite.prepare(`
  INSERT INTO lessons (
    course_id, section_id, title, slug, description, content,
    video_url, duration, order_val, is_free, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const lessonsData = [
  // Section 1
  { sectionIndex: 0, title: 'What is Vue.js and why should you learn it?', slug: 'what-is-vue', duration: '08:30', order: 1, isFree: true },
  { sectionIndex: 0, title: 'Installing and setting up development environment', slug: 'installation-setup', duration: '12:45', order: 2, isFree: true },
  { sectionIndex: 0, title: 'Vue project structure', slug: 'project-structure', duration: '10:20', order: 3, isFree: false },
  
  // Section 2
  { sectionIndex: 1, title: 'Creating your first component', slug: 'first-component', duration: '15:00', order: 1, isFree: false },
  { sectionIndex: 1, title: 'Props and passing data to component', slug: 'props-data-passing', duration: '18:30', order: 2, isFree: false },
  { sectionIndex: 1, title: 'Events and parent-child communication', slug: 'events-communication', duration: '14:15', order: 3, isFree: false },
  
  // Section 3
  { sectionIndex: 2, title: 'Introduction to Composition API', slug: 'composition-api-intro', duration: '20:00', order: 1, isFree: false },
  { sectionIndex: 2, title: 'ref and reactive', slug: 'ref-reactive', duration: '16:45', order: 2, isFree: false },
  { sectionIndex: 2, title: 'computed and watch', slug: 'computed-watch', duration: '22:30', order: 3, isFree: false },
  
  // Section 4
  { sectionIndex: 3, title: 'Installing and setting up Nuxt 3', slug: 'nuxt-3-setup', duration: '14:00', order: 1, isFree: false },
  { sectionIndex: 3, title: 'Folder structure in Nuxt', slug: 'nuxt-folder-structure', duration: '11:30', order: 2, isFree: false },
  { sectionIndex: 3, title: 'Server-Side Rendering in Nuxt', slug: 'nuxt-ssr', duration: '25:00', order: 3, isFree: false },
]

let lessonCount = 0
for (const lesson of lessonsData) {
  insertLesson.run(
    courseId,
    sectionIds[lesson.sectionIndex],
    lesson.title,
    lesson.slug,
    `Description for lesson ${lesson.title}`,
    `# ${lesson.title}\n\nFull content of this lesson goes here...\n\n## Topics\n\n- Topic 1\n- Topic 2\n- Topic 3`,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lesson.duration,
    lesson.order,
    lesson.isFree ? 1 : 0,
    now,
    now
  )
  lessonCount++
}

console.log('📝 Lessons created:', lessonCount)

// Insert learning objectives
const insertObjective = sqlite.prepare(`
  INSERT INTO course_learning_objectives (course_id, objective, order_val)
  VALUES (?, ?, ?)
`)

const objectives = [
  'Complete mastery of Vue.js 3 and Composition API',
  'Building reusable components',
  'State management with Pinia',
  'Working with Vue Router and navigation',
  'Complete understanding of Nuxt 3 and SSR',
  'Connecting to API and data management',
]

objectives.forEach((obj, index) => {
  insertObjective.run(courseId, obj, index + 1)
})

console.log('🎯 Learning objectives created:', objectives.length)

// Insert a test user
const insertUser = sqlite.prepare(`
  INSERT INTO users (email, password, name, avatar, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)
const userResult = insertUser.run(
  'test@example.com',
  '$2b$10$hashedpassword', // In real app, hash the password
  'Test User',
  '/images/users/default.jpg',
  'student',
  now,
  now
)

console.log('👤 Test user created')

// Insert some reviews
const insertReview = sqlite.prepare(`
  INSERT INTO reviews (course_id, user_id, rating, comment, created_at)
  VALUES (?, ?, ?, ?, ?)
`)

insertReview.run(courseId, userResult.lastInsertRowid, 5, 'Great course! Learned a lot.', now)
insertReview.run(courseId, userResult.lastInsertRowid, 4, 'Good explanations but could be more detailed.', now)

console.log('⭐ Reviews created')

// Verify data
const courseCheck = sqlite.prepare('SELECT * FROM courses WHERE id = ?').get(courseId)
const sectionsCheck = sqlite.prepare('SELECT COUNT(*) as count FROM course_content_sections WHERE course_id = ?').get(courseId)
const lessonsCheck = sqlite.prepare('SELECT COUNT(*) as count FROM lessons WHERE course_id = ?').get(courseId)

console.log('\n✅ Database setup complete!')
console.log('📊 Summary:')
console.log(`   - Course: "${courseCheck.title}" (slug: ${courseCheck.slug})`)
console.log(`   - Sections: ${sectionsCheck.count}`)
console.log(`   - Lessons: ${lessonsCheck.count}`)

sqlite.close()
console.log('\n🎉 Done! Database is ready at:', DB_PATH)