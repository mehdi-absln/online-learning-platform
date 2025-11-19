import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { config } from 'dotenv'

config() // Load environment variables

const sqlite = new Database(process.env.DATABASE_URL || './data/db.sqlite')
export const db = drizzle(sqlite)