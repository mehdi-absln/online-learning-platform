import { db } from '../server/db'
import { courses } from '../server/db/schema'

async function listCourses() {
  const allCourses = await db.select({ id: courses.id, title: courses.title, slug: courses.slug }).from(courses)
  for (const course of allCourses) {
  }
}

listCourses().catch(console.error).finally(() => process.exit())
