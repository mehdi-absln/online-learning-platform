import { db } from '../server/db'
import { sql } from 'drizzle-orm'

async function addLessonProgressTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      is_completed INTEGER DEFAULT 0,
      is_bookmarked INTEGER DEFAULT 0,
      notes TEXT,
      completed_at INTEGER,
      progress_percentage INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)

  await db.run(sql`
    CREATE INDEX IF NOT EXISTS progress_user_id_idx ON lesson_progress(user_id)
  `)

  await db.run(sql`
    CREATE INDEX IF NOT EXISTS progress_lesson_id_idx ON lesson_progress(lesson_id)
  `)

  await db.run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS progress_user_lesson_idx ON lesson_progress(user_id, lesson_id)
  `)

}

addLessonProgressTable()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1)
  })
