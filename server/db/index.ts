import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'
// import { seedCourses } from '../utils/seed-courses'  // Commenting out automatic seeding since DB is already seeded

// Determine the correct database path
const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './server/data/db.sqlite'  // Using the db.sqlite file in server/data
console.log(`Using database path: ${dbPath}`)

const sqlite = new Database(dbPath)
export const db = drizzle(sqlite, { schema })

// Only run migrations if needed
try {
  // Run migrations
  console.log('Starting database migrations...')
  migrate(db, { migrationsFolder: '../drizzle/migrations' })
  console.log('Database migrations completed successfully')
  
  // Automatic seeding is commented out since DB is already populated
  // Uncomment the following lines if you need to re-seed the database:
  /*
  console.log('Starting to seed courses...')
  seedCourses().catch(console.error)
  */
} catch (error) {
  // If migration fails because meta files are missing, tables already exist, or other issues, log and continue
  console.log('Migration issue (this may be normal):', error.message)
}
