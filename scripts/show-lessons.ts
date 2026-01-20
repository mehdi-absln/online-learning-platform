import { db } from '../server/db'
import { lessons } from '../server/db/schema'

async function showLessons() {
  const allLessons = await db.select().from(lessons)
  
  console.log('\n📚 All Lessons:\n')
  console.log(JSON.stringify(allLessons, null, 2))
  console.log(`\n✅ Total: ${allLessons.length} lessons`)
}

showLessons()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })