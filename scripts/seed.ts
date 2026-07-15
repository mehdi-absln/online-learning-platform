import 'dotenv/config'
import { db } from '../server/db/index'
import {
  users,
  instructors,
  categories,
  courses,
  courseContentSections,
  lessons,
  courseLearningObjectives,
  blogs,
} from '../server/db/schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Seeding database...')

  const now = new Date()
  const hashedPassword = await bcrypt.hash('password123', 12)

  // ───── Users ─────
  const [admin] = await db
    .insert(users)
    .values({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning()

  const [student] = await db
    .insert(users)
    .values({
      username: 'student',
      email: 'student@example.com',
      password: hashedPassword,
      name: 'Student User',
      role: 'student',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning()

  if (!admin) {
    console.log('Admin user already exists, skipping user creation...')
  }
  if (!student) {
    console.log('Student user already exists, skipping user creation...')
  }

  // Fetch admin user (may have been inserted or already existed)
  const adminUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.username, 'admin'),
  })
  if (!adminUser) {
    console.error('Failed to find admin user')
    process.exit(1)
  }

  // ───── Instructor ─────
  const [instructor] = await db
    .insert(instructors)
    .values({
      userId: adminUser.id,
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer',
      bio: 'Full-stack developer with 10+ years of experience in web technologies.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: now,
    })
    .onConflictDoNothing()
    .returning()

  const instructorRecord = instructor
    ?? await db.query.instructors.findFirst({
      where: (i, { eq }) => eq(i.userId, adminUser.id),
    })

  if (!instructorRecord) {
    console.error('Failed to find or create instructor')
    process.exit(1)
  }

  // ───── Category ─────
  const [category] = await db
    .insert(categories)
    .values({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Learn modern web development technologies',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning()

  const categoryRecord = category
    ?? await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.slug, 'web-development'),
    })

  // ───── Courses ─────
  const courseData = [
    {
      title: 'Complete Nuxt.js Developer Guide',
      slug: 'complete-nuxtjs-developer-guide',
      description: 'Master Nuxt.js 4 from scratch. Build production-ready applications with server-side rendering, auto-imports, and the full Nuxt ecosystem.',
      shortDescription: 'Master Nuxt.js 4 from scratch with hands-on projects.',
      price: 49.99,
      originalPrice: 99.99,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      instructorId: instructorRecord.id,
      categoryId: categoryRecord?.id ?? null,
      level: 'intermediate',
      language: 'en',
      duration: '42h 30m',
      lessonsCount: 12,
      studentsCount: 1250,
      rating: 4.8,
      reviewsCount: 324,
      isFeatured: true,
      isPublished: true,
      tags: 'nuxt,vue,typescript,ssr',
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'TypeScript Fundamentals',
      slug: 'typescript-fundamentals',
      description: 'Learn TypeScript from the ground up. Understand types, interfaces, generics, and advanced patterns used in modern web development.',
      shortDescription: 'Learn TypeScript from the ground up with practical examples.',
      price: 39.99,
      originalPrice: 79.99,
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      instructorId: instructorRecord.id,
      categoryId: categoryRecord?.id ?? null,
      level: 'beginner',
      language: 'en',
      duration: '28h 15m',
      lessonsCount: 10,
      studentsCount: 2100,
      rating: 4.9,
      reviewsCount: 512,
      isFeatured: true,
      isPublished: true,
      tags: 'typescript,javascript,web',
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Tailwind CSS Masterclass',
      slug: 'tailwind-css-masterclass',
      description: 'Build beautiful, responsive UIs with Tailwind CSS. Learn utility-first CSS, custom themes, animations, and component design patterns.',
      shortDescription: 'Build beautiful UIs with Tailwind CSS utility-first approach.',
      price: 29.99,
      originalPrice: 59.99,
      thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
      instructorId: instructorRecord.id,
      categoryId: categoryRecord?.id ?? null,
      level: 'beginner',
      language: 'en',
      duration: '18h 45m',
      lessonsCount: 8,
      studentsCount: 3400,
      rating: 4.7,
      reviewsCount: 289,
      isFeatured: false,
      isPublished: true,
      tags: 'css,tailwind,design,frontend',
      createdAt: now,
      updatedAt: now,
    },
  ]

  const insertedCourses = []
  for (const course of courseData) {
    const [inserted] = await db
      .insert(courses)
      .values(course)
      .onConflictDoNothing()
      .returning()

    const record = inserted
      ?? await db.query.courses.findFirst({
        where: (c, { eq }) => eq(c.slug, course.slug),
      })

    if (record) insertedCourses.push(record)
  }

  // ───── Sections & Lessons (for first course) ─────
  const firstCourse = insertedCourses[0]
  if (firstCourse) {
    const [section1] = await db
      .insert(courseContentSections)
      .values({
        courseId: firstCourse.id,
        title: 'Getting Started',
        description: 'Introduction to Nuxt.js and project setup',
        orderVal: 0,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning()

    const section1Record = section1
      ?? await db.query.courseContentSections.findFirst({
        where: (s, { eq, and }) => and(
          eq(s.courseId, firstCourse.id),
          eq(s.title, 'Getting Started'),
        ),
      })

    if (section1Record) {
      const lessonData = [
        {
          courseId: firstCourse.id,
          sectionId: section1Record.id,
          title: 'Introduction to Nuxt.js',
          slug: 'introduction-to-nuxtjs',
          description: 'What is Nuxt.js and why use it?',
          content: 'Nuxt.js is a powerful Vue.js framework...',
          duration: '15:30',
          orderVal: 0,
          isFree: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          courseId: firstCourse.id,
          sectionId: section1Record.id,
          title: 'Project Setup',
          slug: 'project-setup',
          description: 'Setting up your first Nuxt project',
          content: 'Let\'s create a new Nuxt project...',
          duration: '22:15',
          orderVal: 1,
          isFree: true,
          createdAt: now,
          updatedAt: now,
        },
      ]

      for (const lesson of lessonData) {
        await db.insert(lessons).values(lesson).onConflictDoNothing()
      }
    }

    // ───── Learning Objectives (first course) ─────
    const objectives = [
      'Build full-stack applications with Nuxt.js',
      'Understand server-side rendering (SSR)',
      'Implement authentication and authorization',
      'Deploy to production with confidence',
    ]

    for (const [i, objective] of objectives.entries()) {
      await db
        .insert(courseLearningObjectives)
        .values({
          courseId: firstCourse.id,
          objective,
          orderVal: i,
        })
        .onConflictDoNothing()
    }
  }

  // ───── Sections & Lessons (for second course - TypeScript) ─────
  const secondCourse = insertedCourses[1]
  if (secondCourse) {
    const [tsSection1] = await db
      .insert(courseContentSections)
      .values({
        courseId: secondCourse.id,
        title: 'TypeScript Basics',
        description: 'Getting started with TypeScript fundamentals',
        orderVal: 0,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning()

    const tsSection1Record = tsSection1
      ?? await db.query.courseContentSections.findFirst({
        where: (s, { eq, and }) => and(
          eq(s.courseId, secondCourse.id),
          eq(s.title, 'TypeScript Basics'),
        ),
      })

    if (tsSection1Record) {
      const tsLessonData = [
        {
          courseId: secondCourse.id,
          sectionId: tsSection1Record.id,
          title: 'Why TypeScript?',
          slug: 'why-typescript',
          description: 'Understanding the benefits of TypeScript over JavaScript',
          content: 'TypeScript adds static typing to JavaScript...',
          duration: '12:00',
          orderVal: 0,
          isFree: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          courseId: secondCourse.id,
          sectionId: tsSection1Record.id,
          title: 'Types and Interfaces',
          slug: 'types-and-interfaces',
          description: 'Learn about basic types and interfaces in TypeScript',
          content: 'Types and interfaces are core concepts...',
          duration: '25:30',
          orderVal: 1,
          isFree: false,
          createdAt: now,
          updatedAt: now,
        },
      ]

      for (const lesson of tsLessonData) {
        await db.insert(lessons).values(lesson).onConflictDoNothing()
      }
    }

    const tsObjectives = [
      'Understand TypeScript type system and static typing',
      'Work with interfaces, generics, and advanced types',
      'Configure TypeScript for real-world projects',
      'Apply TypeScript best practices in web development',
    ]

    for (const [i, objective] of tsObjectives.entries()) {
      await db
        .insert(courseLearningObjectives)
        .values({
          courseId: secondCourse.id,
          objective,
          orderVal: i,
        })
        .onConflictDoNothing()
    }
  }

  // ───── Sections & Lessons (for third course - Tailwind) ─────
  const thirdCourse = insertedCourses[2]
  if (thirdCourse) {
    const [twSection1] = await db
      .insert(courseContentSections)
      .values({
        courseId: thirdCourse.id,
        title: 'Tailwind CSS Fundamentals',
        description: 'Core concepts of utility-first CSS',
        orderVal: 0,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning()

    const twSection1Record = twSection1
      ?? await db.query.courseContentSections.findFirst({
        where: (s, { eq, and }) => and(
          eq(s.courseId, thirdCourse.id),
          eq(s.title, 'Tailwind CSS Fundamentals'),
        ),
      })

    if (twSection1Record) {
      const twLessonData = [
        {
          courseId: thirdCourse.id,
          sectionId: twSection1Record.id,
          title: 'Introduction to Tailwind CSS',
          slug: 'introduction-to-tailwind',
          description: 'What is utility-first CSS and why Tailwind?',
          content: 'Tailwind CSS is a utility-first CSS framework...',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '10:15',
          orderVal: 0,
          isFree: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          courseId: thirdCourse.id,
          sectionId: twSection1Record.id,
          title: 'Responsive Design with Tailwind',
          slug: 'responsive-design-tailwind',
          description: 'Build responsive layouts using Tailwind breakpoints',
          content: 'Tailwind makes responsive design simple...',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '20:45',
          orderVal: 1,
          isFree: false,
          createdAt: now,
          updatedAt: now,
        },
      ]

      for (const lesson of twLessonData) {
        await db
          .insert(lessons)
          .values(lesson)
          .onConflictDoUpdate({
            target: lessons.slug,
            set: {
              title: lesson.title,
              description: lesson.description,
              content: lesson.content,
              videoUrl: lesson.videoUrl,
              duration: lesson.duration,
              isFree: lesson.isFree,
              orderVal: lesson.orderVal,
              updatedAt: lesson.updatedAt,
            },
          })
      }
    }

    const twObjectives = [
      'Build responsive UIs with utility-first CSS',
      'Customize Tailwind themes and configuration',
      'Create reusable component patterns',
      'Implement animations and transitions with Tailwind',
    ]

    for (const [i, objective] of twObjectives.entries()) {
      await db
        .insert(courseLearningObjectives)
        .values({
          courseId: thirdCourse.id,
          objective,
          orderVal: i,
        })
        .onConflictDoNothing()
    }
  }

  // ───── Blogs ─────
  if (adminUser) {
    const blogData = [
      {
        title: 'Getting Started with Nuxt 4',
        slug: 'getting-started-with-nuxt-4',
        content: 'Nuxt 4 brings exciting new features including improved performance, better TypeScript support, and a more intuitive API. In this post, we explore the key changes and how to migrate your existing projects.',
        excerpt: 'Explore the exciting new features in Nuxt 4 and learn how to migrate your projects.',
        coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        status: 'published',
        authorId: adminUser.id,
        readingTime: 5,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Why TypeScript is a Must-Have in 2026',
        slug: 'why-typescript-is-a-must-have-2026',
        content: 'TypeScript has become the standard for modern web development. From better IDE support to catching bugs at compile time, here are the top reasons you should be using TypeScript today.',
        excerpt: 'Discover why TypeScript has become essential for modern web development.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        status: 'published',
        authorId: adminUser.id,
        readingTime: 7,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]

    for (const blog of blogData) {
      await db.insert(blogs).values(blog).onConflictDoNothing()
    }
  }

  console.log('Seed completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
