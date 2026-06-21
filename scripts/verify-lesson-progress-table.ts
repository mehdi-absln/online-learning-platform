import { db } from '../server/db'
import { lessonProgress } from '../server/db/schema'
import { count as _count } from 'drizzle-orm'

async function verifyLessonProgressTable() {
  console.log('Verifying lesson_progress table...')

  try {
    // Try to query the table to see if it exists
    const totalRecords = await db.select().from(lessonProgress).all()
    console.log(`✅ lesson_progress table exists and is accessible`)
    console.log(`Records in table: ${totalRecords.length}`)

    // Show the first few records if any exist
    if (totalRecords.length > 0) {
      console.log('Sample records:', totalRecords.slice(0, 3))
    }
    else {
      console.log('Table is empty as expected')
    }
  }
  catch (error) {
    console.error('❌ Error accessing lesson_progress table:', error)
  }
}

verifyLessonProgressTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })
