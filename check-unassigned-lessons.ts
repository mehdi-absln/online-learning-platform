// Direct database query to check unassigned lessons
import Database from 'better-sqlite3'

const sqlite = new Database('./server/data/db.sqlite')
const result = sqlite.prepare("SELECT id, title, section_id FROM lessons WHERE course_id = 23 AND (section_id IS NULL OR section_id = '');").all()
console.log('Unassigned lessons for course 23:', result)

sqlite.close()