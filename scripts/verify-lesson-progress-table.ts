import { db } from '../server/db'
import { lessonProgress } from '../server/db/schema'
import { count as _count } from 'drizzle-orm'

async function verifyLessonProgressTable() {
  try {
    // Try to query the table to see if it exists
    const totalRecords = await db.select().from(lessonProgress).all()
    // Show the first few records if any exist
    if (totalRecords.length > 0) {
    }
    else {
    }
  }
  catch (error) {
  }
}

verifyLessonProgressTable()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1)
  })
