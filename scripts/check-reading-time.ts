// scripts/check-reading-time.ts
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'server/data/db.sqlite')
const db = new Database(dbPath)

console.log('📂 Database path:', dbPath)

const result = db.prepare('SELECT id, title, reading_time FROM blogs').all()
console.table(result)

db.close()
