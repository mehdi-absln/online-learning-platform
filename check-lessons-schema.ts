// Direct database query to check the schema
import Database from 'better-sqlite3'

const sqlite = new Database('./server/data/db.sqlite')
const result = sqlite.prepare("PRAGMA table_info(lessons);").all()
console.log('Lessons table schema:', result)

sqlite.close()