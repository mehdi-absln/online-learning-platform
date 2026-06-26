import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function makeSuperAdmin() {
  const username = 'mehdiabsalan12345678'
  await db.update(users)
    .set({ role: 'superadmin' })
    .where(eq(users.username, username))
}

makeSuperAdmin()
