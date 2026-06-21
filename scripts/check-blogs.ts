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

    console.log('\n--- Blog Content Report ---\n')
    console.table(report)

    // نمایش بخشی از متن طولانی‌ترین بلاگ برای اطمینان
    if (allBlogs.length > 0) {
      console.log('\n--- Sample Content (First 100 chars) ---')
      console.log(`"${allBlogs[0].content?.substring(0, 100)}..."`)
    }
  }
  catch (error) {
    console.error('Error:', error)
  }
}

check()
