import { sqlite, db } from '../../server/db/index'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { join } from 'path'
import * as schema from '../../server/db/schema'

let isMigrated = false

export async function setupTestDb() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupTestDb should only be called in test mode')
  }

  // Run migrations only once per process/worker
  if (!isMigrated) {
    await migrate(db, {
      migrationsFolder: join(process.cwd(), 'server', 'drizzle', 'migrations'),
    })
    isMigrated = true
  }

  return { db, sqlite, schema }
}

export async function clearDb() {
  // We need to delete in correct order due to FK or just disable FK temporarily
  sqlite.prepare('PRAGMA foreign_keys = OFF').run()

  const tables = [
    'cart_items',
    'order_items',
    'enrollments',
    'orders',
    'courses',
    'instructors',
    'users',
    'categories',
    'blogs',
    'lessons',
    'course_content_sections',
    'course_learning_objectives',
    'reviews',
    'lesson_progress',
  ]

  for (const table of tables) {
    try {
      sqlite.prepare(`DELETE FROM ${table}`).run()
    }
    catch {
      // Table might not exist yet if migrations failed
    }
  }

  sqlite.prepare('PRAGMA foreign_keys = ON').run()
}
