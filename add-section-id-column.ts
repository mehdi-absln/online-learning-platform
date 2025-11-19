// Direct database query to add section_id column
import Database from 'better-sqlite3'

const sqlite = new Database('./server/data/db.sqlite')

try {
  // Add the section_id column if it doesn't exist
  sqlite.exec("ALTER TABLE lessons ADD COLUMN section_id INTEGER;")
  console.log('Section_id column added successfully to lessons table')
} catch (error) {
  console.log('Section_id column may already exist:', error.message)
}

sqlite.close()