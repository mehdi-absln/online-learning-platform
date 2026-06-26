// scripts/calculate-reading-times.ts
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'server/data/db.sqlite')
const sqlite = new Database(dbPath)

function calculateReadingTime(content: string): number {
  if (!content) return 1

  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  return Math.max(1, minutes)
}

function updateReadingTimes() {
  try {
    // Get all blogs
    const allBlogs = sqlite.prepare('SELECT id, title, content FROM blogs').all() as {
      id: number
      title: string
      content: string
    }[]

    // Prepare update statement
    const updateStmt = sqlite.prepare('UPDATE blogs SET reading_time = ? WHERE id = ?')

    for (const blog of allBlogs) {
      const readingTime = calculateReadingTime(blog.content)

      updateStmt.run(readingTime, blog.id)

      const title = blog.title.length > 30
        ? blog.title.substring(0, 30) + '...'
        : blog.title

    }

  }
  catch (error) {
    process.exit(1)
  }

  sqlite.close()
  process.exit(0)
}

updateReadingTimes()
