import { requireAuth } from '../../utils/auth-helpers'
import { verifyPassword, hashPassword } from '../../db/user-service'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    const body = await readBody<{
      currentPassword: string
      newPassword: string
    }>(event)

    if (!body?.currentPassword || !body?.newPassword) {
      return errorResponse('Current and new passwords are required.')
    }

    if (body.newPassword.length < 6) {
      return errorResponse('New password must be at least 6 characters.')
    }

    const isValid = await verifyPassword(body.currentPassword, user.password)
    if (!isValid) {
      return errorResponse('Current password is incorrect.')
    }

    const hashedPassword = await hashPassword(body.newPassword)

    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id))

    return successResponse('Password updated successfully.')
  }
  catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const nuxtError = error as { statusCode?: number, statusMessage?: string, message?: string }
      return errorResponse(
        nuxtError.statusMessage || 'Failed to change password',
        nuxtError.message,
      )
    }

    return errorResponse('Internal server error', (error as Error).message)
  }
})
