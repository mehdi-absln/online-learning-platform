// Direct database query to assign unassigned lessons
import Database from 'better-sqlite3'

const sqlite = new Database('./server/data/db.sqlite')

try {
  // Get the content sections for course 23
  const sections = sqlite.prepare("SELECT id, title FROM course_content_sections WHERE course_id = 23 ORDER BY 'order';").all()
  console.log('Sections for course 23:', sections)

  if (sections.length > 0) {
    // Get the unassigned lessons for course 23
    const unassignedLessons = sqlite.prepare("SELECT id, title FROM lessons WHERE course_id = 23 AND section_id IS NULL;").all()
    console.log('Unassigned lessons for course 23:', unassignedLessons)

    // Assign each lesson to a section
    for (let i = 0; i < unassignedLessons.length; i++) {
      const lesson = unassignedLessons[i]
      const section = sections[i % sections.length] // Cycle through sections if more lessons than sections

      // Update the lesson with the section ID
      sqlite.prepare("UPDATE lessons SET section_id = ? WHERE id = ?;").run(section.id, lesson.id)
      console.log(`Assigned lesson "${lesson.title}" (ID: ${lesson.id}) to section "${section.title}" (ID: ${section.id})`)
    }
  } else {
    console.log('No sections found for course 23')
  }

  console.log('Manual lesson assignment completed!')
} catch (error) {
  console.error('Error assigning lessons manually:', error)
}

sqlite.close()