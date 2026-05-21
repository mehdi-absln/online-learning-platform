// scripts/migrate-user-roles.ts
import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function migrate() {
  const updated = await db
    .update(users)
    .set({ role: 'student' })
    .where(eq(users.role, 'user'))
    .returning({ id: users.id, username: users.username, newRole: users.role })

  console.log(`✅ Migrated ${updated.length} users from 'user' to 'student':`)
  updated.forEach(u => console.log(`   ${u.username}`))
}

migrate()
