import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, cpSync } from 'fs'
import * as schema from '../../server/db/schema'

const sqlite = new Database(':memory:')
const db = drizzle(sqlite, { schema })

let isMigrated = false

const originalMigrationsPath = join(process.cwd(), 'server', 'drizzle', 'migrations')
const workerId = process.env.VITEST_WORKER_ID ?? process.env.VITEST_POOL_ID ?? 'main'
const testMigrationsPath = join('C:\\Users\\DONYAY~1\\AppData\\Local\\Temp\\kilo', `online-learning-platform-test-migrations-${process.pid}-${workerId}`)

function ensurePatchedTestMigrations() {
  if (!existsSync(testMigrationsPath)) {
    cpSync(originalMigrationsPath, testMigrationsPath, { recursive: true })

    const patchedMigrationPath = join(testMigrationsPath, '0003_mean_ezekiel_stane.sql')
    const patchedContent = readFileSync(patchedMigrationPath, 'utf8').replace(
      'SELECT "id", "username", "email", "password", "name", "avatar", "role", "created_at", "updated_at" FROM `users`;',
      'SELECT "id", "email", "email", "password", "name", "avatar", "role", "created_at", "updated_at" FROM `users`;',
    )
    writeFileSync(patchedMigrationPath, patchedContent)
  }
}

export async function setupTestDb() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupTestDb should only be called in test mode')
  }

  // Run migrations only once per process/worker
  if (!isMigrated) {
    ensurePatchedTestMigrations()
    await migrate(db, {
      migrationsFolder: testMigrationsPath,
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
