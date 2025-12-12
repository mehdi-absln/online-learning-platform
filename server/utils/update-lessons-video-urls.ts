import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { lessons } from '../db/schema'
import { isNull } from 'drizzle-orm'

// Connect to the database
const sqlite = new Database(
  process.env.DATABASE_URL?.replace('file:', '') || './server/data/db.sqlite',
)
const db = drizzle(sqlite)

async function updateLessonsWithVideoUrls() {
  console.log('Updating lessons with video URLs...')

  // Update lessons that don't have a videoUrl
  await db
    .update(lessons)
    .set({
      videoUrl: 'https://www.youtube.com/watch?v=EDj-Xo8AlSU',
    })
    .where(isNull(lessons.videoUrl))

  console.log('Lessons updated with video URLs')

  // Verify the update
  const count = await db.select({ count: lessons.id }).from(lessons).where(isNull(lessons.videoUrl))

  console.log(`Lessons without videoUrl after update: ${count.length}`)

  console.log('Update completed successfully')
}

// Run the update function
updateLessonsWithVideoUrls()
  .then(() => {
    console.log('Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error updating lessons:', error)
    process.exit(1)
  })
