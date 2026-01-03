import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import * as schema from './schema'

// Database path in server/data folder
const DB_PATH = join(process.cwd(), 'server', 'data', 'db.sqlite')

console.log('Database path:', DB_PATH)

const sqlite = new Database(DB_PATH)
export const db = drizzle(sqlite, { schema })

export { sqlite }
