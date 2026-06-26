// scripts/sync-instructors.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { users, instructors } from '../server/db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcrypt'

const sqlite = new Database('./server/data/db.sqlite')
const db = drizzle(sqlite)

async function syncInstructors() {

  try {
    const allInstructors = await db.select().from(instructors)

    const defaultPassword = await hash('password123', 10)
    const now = new Date()

    for (const instructor of allInstructors) {

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.name, instructor.name))
        .limit(1)

      let userId: number

      if (existingUser.length > 0) {
        userId = existingUser[0].id
        await db
          .update(users)
          .set({ role: 'instructor' })
          .where(eq(users.id, userId))
      }
      else {
        const email = instructor.name
          .toLowerCase()
          .replace(/\s+/g, '.')
          .concat('@example.com')

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
      }

      await db
        .update(instructors)
        .set({ userId: userId })
        .where(eq(instructors.id, instructor.id))
    }


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


  }
  catch (error) {
    process.exit(1)
  }
  finally {
    sqlite.close()
  }
}

syncInstructors()
