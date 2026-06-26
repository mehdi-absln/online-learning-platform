import { db } from '../server/db'
import { lessons } from '../server/db/schema'

async function showLessons() {
  const allLessons = await db.select().from(lessons)

}

showLessons()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1)
  })
