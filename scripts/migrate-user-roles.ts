// scripts/migrate-user-roles.ts
import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function migrate() {
  await db
    .update(users)
    .set({ role: 'student' })
    .where(eq(users.role, 'user'))
}

migrate()
