import { db } from './index'
import { 
  courses, 
  courseContentSections, 
  lessons, 
  courseLearningObjectives,
  instructors 
} from './schema'

export async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  const now = new Date()

  try {
    // 1. ایجاد مدرس
    console.log('👨‍🏫 Creating instructor...')
    const [instructor] = await db.insert(instructors).values({
      name: 'علی احمدی',
      title: 'Senior Developer',
      bio: 'توسعه‌دهنده ارشد با بیش از ۱۰ سال تجربه',
      avatar: '/images/instructors/ali.jpg',
      createdAt: now,
    }).returning()

    // 2. ایجاد دوره
    console.log('📚 Creating course...')
    const [course] = await db.insert(courses).values({
      title: 'آموزش جامع Vue.js 3',
      slug: 'vue-js-3-complete',
      description: 'در این دوره به صورت کامل Vue.js 3 رو یاد می‌گیرید',
      price: 299000,
      originalPrice: 499000,
      thumbnail: '/images/courses/vue-course.jpg',
      instructorId: instructor.id,
      level: 'intermediate',
      language: 'fa',
      duration: '12 ساعت',
      lessonsCount: 45,
      studentsCount: 1250,
      rating: 4.8,
      reviewsCount: 89,
      isFeatured: true,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    }).returning()

    console.log('✅ Course created with ID:', course.id)

    // 3. ایجاد بخش‌ها
    console.log('📂 Creating sections...')
    const sectionsData = [
      { title: 'مقدمه و آشنایی', description: 'آشنایی با Vue.js و نصب', orderVal: 1 },
      { title: 'مفاهیم پایه', description: 'کامپوننت‌ها، props، events', orderVal: 2 },
      { title: 'Composition API', description: 'ref, reactive, computed', orderVal: 3 },
      { title: 'پروژه عملی', description: 'ساخت یک اپلیکیشن کامل', orderVal: 4 },
    ]

    const createdSections = []
    for (const sectionData of sectionsData) {
      const [section] = await db.insert(courseContentSections).values({
        courseId: course.id,
        title: sectionData.title,
        description: sectionData.description,
        orderVal: sectionData.orderVal,
        createdAt: now,
        updatedAt: now,
      }).returning()
      createdSections.push(section)
    }

    console.log('✅ Sections created:', createdSections.length)

    // 4. ایجاد درس‌ها
    console.log('📝 Creating lessons...')
    const lessonsData = [
      // بخش 1
      { sectionId: createdSections[0].id, title: 'Vue.js چیست؟', slug: 'what-is-vue', duration: '08:30', orderVal: 1 },
      { sectionId: createdSections[0].id, title: 'نصب و راه‌اندازی', slug: 'installation', duration: '12:45', orderVal: 2 },
      { sectionId: createdSections[0].id, title: 'ساختار پروژه', slug: 'project-structure', duration: '10:20', orderVal: 3 },
      
      // بخش 2
      { sectionId: createdSections[1].id, title: 'کامپوننت‌ها', slug: 'components', duration: '15:00', orderVal: 1 },
      { sectionId: createdSections[1].id, title: 'Props و Events', slug: 'props-events', duration: '18:30', orderVal: 2 },
      { sectionId: createdSections[1].id, title: 'Slots', slug: 'slots', duration: '14:15', orderVal: 3 },
      
      // بخش 3
      { sectionId: createdSections[2].id, title: 'ref و reactive', slug: 'ref-reactive', duration: '20:00', orderVal: 1 },
      { sectionId: createdSections[2].id, title: 'computed و watch', slug: 'computed-watch', duration: '16:45', orderVal: 2 },
      { sectionId: createdSections[2].id, title: 'Composables', slug: 'composables', duration: '22:30', orderVal: 3 },
      
      // بخش 4
      { sectionId: createdSections[3].id, title: 'طراحی UI', slug: 'ui-design', duration: '25:00', orderVal: 1 },
      { sectionId: createdSections[3].id, title: 'اتصال به API', slug: 'api-connection', duration: '28:15', orderVal: 2 },
      { sectionId: createdSections[3].id, title: 'دیپلوی پروژه', slug: 'deployment', duration: '18:00', orderVal: 3 },
    ]

    for (const lessonData of lessonsData) {
      await db.insert(lessons).values({
        courseId: course.id,
        sectionId: lessonData.sectionId,
        title: lessonData.title,
        slug: lessonData.slug,
        duration: lessonData.duration,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // نمونه
        description: `توضیحات درس ${lessonData.title}`,
        content: `محتوای کامل درس ${lessonData.title} اینجا قرار می‌گیرد...`,
        orderVal: lessonData.orderVal,
        isFree: lessonData.orderVal === 1, // اولین درس هر بخش رایگان
        createdAt: now,
        updatedAt: now,
      })
    }

    console.log('✅ Lessons created:', lessonsData.length)

    // 5. اهداف یادگیری
    console.log('🎯 Creating learning objectives...')
    const objectives = [
      'آشنایی کامل با Vue.js 3 و Composition API',
      'ساخت کامپوننت‌های قابل استفاده مجدد',
      'مدیریت state با Pinia',
      'کار با Vue Router',
      'اتصال به API و مدیریت داده‌ها',
    ]

    for (let i = 0; i < objectives.length; i++) {
      await db.insert(courseLearningObjectives).values({
        courseId: course.id,
        objective: objectives[i],
        orderVal: i + 1,
      })
    }

    console.log('✅ Learning objectives created:', objectives.length)

    console.log('🎉 Database seeded successfully!')
    
    return { success: true, courseId: course.id, courseSlug: course.slug }
  } catch (error) {
    console.error('❌ Seed error:', error)
    throw error
  }
}

// اجرای مستقیم
// seedDatabase().then(console.log).catch(console.error)