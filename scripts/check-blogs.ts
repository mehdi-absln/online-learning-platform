// scripts/check-blogs.ts
import { db } from '../server/db'
import { blogs } from '../server/db/schema'

async function check() {
  try {
    const allBlogs = await db.select().from(blogs)

    const report = allBlogs.map((blog) => {
      const words = blog.content ? blog.content.trim().split(/\s+/).length : 0
      const minutes = Math.ceil(words / 200)

      return {
        ID: blog.id,
        Title: blog.title.substring(0, 30) + '...',
        Chars: blog.content?.length || 0,
        Words: words,
        CalcMinutes: minutes,
        Status: blog.status,
      }
    })


    if (allBlogs.length > 0) {
    }
  }
  catch (error) {
  }
}

check()
