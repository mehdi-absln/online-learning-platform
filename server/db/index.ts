import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import * as schema from './schema'

// Get database path - works in both dev and production
// Directly reference the db file in the project root
const DB_PATH = join(process.cwd(), 'db.sqlite')

console.log('Database path:', DB_PATH)

const sqlite = new Database(DB_PATH)
export const db = drizzle(sqlite, { schema })

export { sqlite }
