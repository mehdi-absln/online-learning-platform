// scripts/make-admin.ts
import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

async function makeAdmin() {
  const targetEmail = 'mehdiabsalan7+2@gmail.com'

  const result = await db
    .update(users)
    .set({ role: 'admin' })
    .where(eq(users.email, targetEmail))
    .run()

  console.log(`✅ تغییرات: ${result.changes} ردیف به‌روز شد.`)

  // نمایش کاربر بعد از تغییر
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, targetEmail))
    .limit(1)

  if (user) {
    console.log('👤 کاربر فعلی:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })
  }
  else {
    console.log('⚠️ کاربری با این ایمیل پیدا نشد. ابتدا ثبت‌نام کن.')
  }
}

makeAdmin()
