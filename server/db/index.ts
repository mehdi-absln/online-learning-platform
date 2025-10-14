import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

const sqlite = new Database('./server/data/db.sqlite')
export const db = drizzle(sqlite, { schema })

// Run migrations on startup
migrate(db, { migrationsFolder: './server/drizzle/migrations' })
