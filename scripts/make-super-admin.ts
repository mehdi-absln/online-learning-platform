import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function makeSuperAdmin() {
  const username = 'mehdiabsalan12345678' // نام کاربری خودت را بگذار
  await db.update(users)
    .set({ role: 'superadmin' })
    .where(eq(users.username, username))
  console.log(`✅ ${username} is now superadmin.`)
}

makeSuperAdmin()
