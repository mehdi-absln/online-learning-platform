// scripts/sync-instructors.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { users, instructors } from '../server/db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcrypt'

const sqlite = new Database('./server/data/db.sqlite')
const db = drizzle(sqlite)

async function syncInstructors() {
  console.log('🔄 Syncing instructors with users...\n')

  try {
    // 1. گرفتن همه instructors
    const allInstructors = await db.select().from(instructors)
    console.log(`📋 Found ${allInstructors.length} instructors\n`)

    const defaultPassword = await hash('password123', 10)
    const now = new Date()

    for (const instructor of allInstructors) {
      console.log(`👤 Processing: ${instructor.name}`)

      // 2. چک کن آیا user با این اسم وجود داره
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.name, instructor.name))
        .limit(1)

      let userId: number

      if (existingUser.length > 0) {
        // User وجود داره، فقط role رو آپدیت کن
        userId = existingUser[0].id
        await db
          .update(users)
          .set({ role: 'instructor' })
          .where(eq(users.id, userId))
        console.log(`   ✅ Updated existing user (id: ${userId})`)
      } else {
        // User جدید بساز
        const email = instructor.name
          .toLowerCase()
          .replace(/\s+/g, '.')
          .concat('@example.com')

        // ✅ اضافه کردن created_at و updated_at
        const [newUser] = await db
          .insert(users)
          .values({
            name: instructor.name,
            email: email,
            password: defaultPassword,
            role: 'instructor',
            avatar: instructor.avatar,
            bio: instructor.bio,
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        userId = newUser.id
        console.log(`   ✅ Created new user (id: ${userId}, email: ${email})`)
      }

      // 3. آپدیت user_id در instructors
      await db
        .update(instructors)
        .set({ userId: userId })
        .where(eq(instructors.id, instructor.id))
      console.log(`   ✅ Linked instructor.user_id = ${userId}\n`)
    }

    // 4. نمایش نتیجه
    console.log('\n📊 Final Result:\n')
    
    const result = sqlite.prepare(`
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.role,
        i.id as instructor_id,
        i.title
      FROM users u
      LEFT JOIN instructors i ON i.user_id = u.id
      WHERE u.role = 'instructor'
    `).all()

    console.table(result)

    console.log('\n🎉 Sync completed successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    sqlite.close()
  }
}

syncInstructors()