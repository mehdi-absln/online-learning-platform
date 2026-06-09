import { db } from '../server/db'
import { courses } from '../server/db/schema'

async function listCourses() {
  const allCourses = await db.select({ id: courses.id, title: courses.title, slug: courses.slug }).from(courses)
  console.log('📚 Available courses:')
  for (const course of allCourses) {
    console.log(`  - ${course.title} (${course.slug})`)
  }
}

listCourses().catch(console.error).finally(() => process.exit())